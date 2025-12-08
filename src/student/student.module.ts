import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Student } from './entities/student.entity';

@Module({
  imports: [SequelizeModule.forFeature([Student])],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
