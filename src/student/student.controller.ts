import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { Student } from './entities/student.entity';

@ApiTags('students')
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @ApiOperation({ summary: 'Create new student' })
  @ApiResponse({ status: 201, description: 'Student created', type: Student })
  create(@Body() createStudentDto: CreateStudentDto): Promise<Student> {
    return this.studentService.create(createStudentDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all students' })
  @ApiResponse({
    status: 200,
    description: 'List of students',
    type: [Student],
  })
  findAll(): Promise<Student[]> {
    return this.studentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get student by ID' })
  @ApiResponse({ status: 200, description: 'Student found', type: Student })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Student | null> {
    return this.studentService.findOne(id);
  }

  @Get('college/:collegeId')
  @ApiOperation({ summary: 'List students by college' })
  findByCollege(
    @Param('collegeId', ParseIntPipe) collegeId: number,
  ): Promise<Student[]> {
    return this.studentService.findByCollege(collegeId);
  }
}
