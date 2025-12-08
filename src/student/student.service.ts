import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';

@Injectable()
export class StudentService {
  constructor(@InjectModel(Student) private studentModel: typeof Student) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    return this.studentModel.create({
      name: createStudentDto.name,
      collegeId: createStudentDto.collegeId,
    });
  }

  async findAll(): Promise<Student[]> {
    return this.studentModel.findAll({
      include: ['college'],
    });
  }

  async findOne(id: number): Promise<Student | null> {
    return this.studentModel.findByPk(id, {
      include: ['college', 'courseSelections'],
    });
  }

  async findByCollege(collegeId: number): Promise<Student[]> {
    return this.studentModel.findAll({
      where: { collegeId },
      include: ['college'],
    });
  }
}
