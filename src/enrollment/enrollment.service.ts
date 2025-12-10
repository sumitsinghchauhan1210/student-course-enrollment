import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Course } from './entities/course.entity';
import { CourseTimetable } from './entities/course-timetable.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateTimetableDto } from './dto/create-timetable.dto';
import { StudentCourseSelection } from './entities/student-course-selection.entity';
import { Student } from 'src/student/entities/student.entity';
import { EnrollCoursesDto } from './dto/enroll-course.dto';
import { UpdateTimetableBodyDto } from './dto/update-timetable.dto';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectModel(Course) private courseModel: typeof Course,
    @InjectModel(CourseTimetable)
    private timetableModel: typeof CourseTimetable,
    @InjectModel(StudentCourseSelection)
    private selectionModel: typeof StudentCourseSelection,
    @InjectModel(Student) private studentModel: typeof Student,
  ) {}

  // existing:
  createCourse(dto: CreateCourseDto) {
    return this.courseModel.create({
      code: dto.code,
      title: dto.title,
      collegeId: dto.collegeId,
    });
  }

  listCourses() {
    return this.courseModel.findAll({ include: ['college', 'timetables'] });
  }

  async addTimetable(courseId: number, dto: CreateTimetableDto) {
    const course = await this.courseModel.findByPk(courseId);
    if (!course) {
      throw new BadRequestException('Course not found');
    }

    if (dto.startTime >= dto.endTime) {
      throw new BadRequestException('startTime must be before endTime');
    }

    // simple per-course clash check
    const existing = await this.timetableModel.findAll({
      where: { courseId: courseId, dayOfWeek: dto.dayOfWeek },
    });

    const overlaps = existing.some(
      (s) => dto.startTime < s.endTime && s.startTime < dto.endTime,
    );
    if (overlaps) {
      throw new BadRequestException(
        'Timetable clashes with existing slot for this course',
      );
    }

    return this.timetableModel.create({
      courseId: courseId,
      dayOfWeek: dto.dayOfWeek,
      startTime: dto.startTime,
      endTime: dto.endTime,
    });
  }

  listTimetablesForCourse(courseId: number) {
    return this.timetableModel.findAll({ where: { courseId } });
  }

  async enroll(dto: EnrollCoursesDto) {
    const { studentId, courseIds } = dto;

    if (!courseIds?.length) {
      throw new BadRequestException('courseIds cannot be empty');
    }

    // 1) Load student with college
    const student = await this.studentModel.findByPk(studentId);
    if (!student) {
      throw new BadRequestException('Student not found');
    }

    // 2) Load courses and ensure all exist + same college
    const courses = await this.courseModel.findAll({
      where: { id: courseIds },
    });

    if (courses.length !== courseIds.length) {
      throw new BadRequestException('One or more courses not found');
    }

    const invalidCollege = courses.find(
      (c) => c.collegeId !== student.collegeId,
    );
    if (invalidCollege) {
      throw new BadRequestException(
        'All courses must belong to student college',
      );
    }

    // 3) Load timetables for selected courses
    const newSlots = await this.timetableModel.findAll({
      where: { courseId: courseIds },
    });

    // 4) Load existing selections & their timetables
    const existingSelections = await this.selectionModel.findAll({
      where: { studentId },
    });
    const existingCourseIds = existingSelections.map((s) => s.courseId);

    const existingSlots = existingCourseIds.length
      ? await this.timetableModel.findAll({
          where: { courseId: existingCourseIds },
        })
      : [];

    // 5) Check clashes between new courses themselves
    this.ensureNoClash(newSlots, 'Selected courses have timetable clash');

    // 6) Check clashes with already-enrolled courses
    this.ensureNoCrossClash(
      newSlots,
      existingSlots,
      'Selected courses clash with existing enrollment',
    );

    // 7) Save selections (ignore duplicates) in a transaction
    await this.selectionModel.sequelize!.transaction(async (t) => {
      const rows = courseIds.map((courseId) => ({
        studentId,
        courseId,
      }));
      await this.selectionModel.bulkCreate(rows, {
        transaction: t,
        ignoreDuplicates: true,
      });
    });

    return { success: true };
  }

  private ensureNoClash(slots: CourseTimetable[], message: string) {
    for (let i = 0; i < slots.length; i++) {
      for (let j = i + 1; j < slots.length; j++) {
        const a = slots[i];
        const b = slots[j];
        if (a.dayOfWeek !== b.dayOfWeek) continue;

        const overlap = a.startTime < b.endTime && b.startTime < a.endTime;

        if (overlap) {
          throw new BadRequestException(message);
        }
      }
    }
  }

  private ensureNoCrossClash(
    newSlots: CourseTimetable[],
    existingSlots: CourseTimetable[],
    message: string,
  ) {
    for (const a of newSlots) {
      for (const b of existingSlots) {
        if (a.dayOfWeek !== b.dayOfWeek) continue;

        const overlap = a.startTime < b.endTime && b.startTime < a.endTime;

        if (overlap) {
          throw new BadRequestException(message);
        }
      }
    }
  }

  async updateTimetable(id: number, body: UpdateTimetableBodyDto) {
    const timetable = await this.timetableModel.findByPk(id);
    if (!timetable) {
      throw new BadRequestException('Timetable not found');
    }

    // Merge existing + new values
    const dayOfWeek = body.dayOfWeek ?? timetable.dayOfWeek;
    const startTime = body.startTime ?? timetable.startTime;
    const endTime = body.endTime ?? timetable.endTime;

    if (startTime >= endTime) {
      throw new BadRequestException('startTime must be before endTime');
    }

    // Load all students enrolled in this course
    const selections = await this.selectionModel.findAll({
      where: { courseId: timetable.courseId },
    });
    const studentIds = selections.map((s) => s.studentId);

    if (studentIds.length) {
      // Load all other courses’ slots for these students
      const otherSelections = await this.selectionModel.findAll({
        where: {
          studentId: studentIds,
          courseId: { $ne: timetable.courseId } as any,
        },
      });
      const otherCourseIds = otherSelections.map((s) => s.courseId);

      const otherSlots = otherCourseIds.length
        ? await this.timetableModel.findAll({
            where: { courseId: otherCourseIds },
          })
        : [];

      // Check clash of new slot vs others
      for (const s of otherSlots) {
        if (s.dayOfWeek !== dayOfWeek) continue;
        const overlap = startTime < s.endTime && s.startTime < endTime;
        if (overlap) {
          throw new BadRequestException(
            'Update would clash with timetables of already enrolled students',
          );
        }
      }
    }

    // Safe to update
    timetable.dayOfWeek = dayOfWeek;
    timetable.startTime = startTime;
    timetable.endTime = endTime;
    return timetable.save();
  }

  async deleteTimetable(id: number) {
    const timetable = await this.timetableModel.findByPk(id);
    if (!timetable) {
      throw new BadRequestException('Timetable not found');
    }
    await timetable.destroy();
    return { success: true };
  }
}
