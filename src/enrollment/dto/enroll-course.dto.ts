import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ArrayNotEmpty, IsInt, Min } from 'class-validator';

export class EnrollCoursesDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  studentId: number;

  @ApiProperty({ example: [1, 2, 3], type: [Number] })
  @IsArray()
  @ArrayNotEmpty()
  courseIds: number[];
}
