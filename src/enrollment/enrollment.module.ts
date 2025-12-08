import { Module } from '@nestjs/common';
import { EnrollmentController } from './enrollment.controller';
import { EnrollmentService } from './enrollment.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Course } from './entities/course.entity';
import { CourseTimetable } from './entities/course-timetable.entity';
import { StudentCourseSelection } from './entities/student-course-selection.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Course,
      CourseTimetable,
      StudentCourseSelection,
    ]),
  ],
  controllers: [EnrollmentController],
  providers: [EnrollmentService],
})
export class EnrollmentModule {}
