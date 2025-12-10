import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({ example: 'CS101' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'Intro to CS' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  collegeId: number;
}
