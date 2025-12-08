import { Module } from '@nestjs/common';
import { CollegeController } from './college.controller';
import { CollegeService } from './college.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { College } from './entities/college.entity';

@Module({
  imports: [SequelizeModule.forFeature([College])],
  controllers: [CollegeController],
  providers: [CollegeService],
})
export class CollegeModule {}
