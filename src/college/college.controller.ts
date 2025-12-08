import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CollegeService } from './college.service';
import { College } from './entities/college.entity';
import { CreateCollegeDto } from './dto/create-college.dto';

@ApiTags('colleges')
@Controller('colleges')
export class CollegeController {
  constructor(private readonly collegeService: CollegeService) {}

  @Post()
  @ApiOperation({ summary: 'Create college' })
  create(@Body() createCollegeDto: CreateCollegeDto): Promise<College> {
    console.log('In controller');
    return this.collegeService.create(createCollegeDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all colleges' })
  findAll(): Promise<College[]> {
    return this.collegeService.findAll();
  }
}
