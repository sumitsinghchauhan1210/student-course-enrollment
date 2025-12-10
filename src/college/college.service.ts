import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { College } from './entities/college.entity';

@Injectable()
export class CollegeService {
  constructor(@InjectModel(College) private collegeModel: typeof College) {}

  create(createCollegeDto: { name: string }): Promise<College> {
    return this.collegeModel.create({ name: createCollegeDto.name });
  }

  findAll(): Promise<College[]> {
    return this.collegeModel.findAll({ include: 'students' });
  }
}
