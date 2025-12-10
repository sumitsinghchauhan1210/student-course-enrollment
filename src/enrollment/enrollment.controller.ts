import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EnrollmentService } from './enrollment.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateTimetableDto } from './dto/create-timetable.dto';
import { EnrollCoursesDto } from './dto/enroll-course.dto';
import { UpdateTimetableBodyDto } from './dto/update-timetable.dto';

@ApiTags('courses')
@Controller()
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post('courses')
  @ApiOperation({ summary: 'Create course for a college' })
  createCourse(@Body() dto: CreateCourseDto) {
    return this.enrollmentService.createCourse(dto);
  }

  @Get('courses')
  @ApiOperation({ summary: 'List all courses with timetables' })
  listCourses() {
    return this.enrollmentService.listCourses();
  }

  @Post('courses/:courseId/timetables')
  @ApiOperation({ summary: 'Add timetable slot to a course' })
  addTimetable(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Body() body: CreateTimetableDto,
  ) {
    return this.enrollmentService.addTimetable(courseId, body);
  }

  @Get('courses/:courseId/timetables')
  @ApiOperation({ summary: 'List timetables of a course' })
  listCourseTimetables(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.enrollmentService.listTimetablesForCourse(courseId);
  }

  @Post('enrollments')
  @ApiOperation({ summary: 'Enroll student in courses with clash validation' })
  enroll(@Body() dto: EnrollCoursesDto) {
    return this.enrollmentService.enroll(dto);
  }

  @Patch('timetables/:id')
  @ApiOperation({ summary: 'Update a course timetable slot (admin)' })
  updateTimetable(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateTimetableBodyDto,
  ) {
    return this.enrollmentService.updateTimetable(id, body);
  }

  @Delete('timetables/:id')
  @ApiOperation({ summary: 'Delete a course timetable slot (admin)' })
  deleteTimetable(@Param('id', ParseIntPipe) id: number) {
    return this.enrollmentService.deleteTimetable(id);
  }
}
