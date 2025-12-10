import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min, Max } from 'class-validator';

export class CreateTimetableDto {
  @ApiProperty({ example: 1, description: '1=Mon ... 7=Sun' })
  @IsInt()
  @Min(1)
  @Max(7)
  dayOfWeek: number;

  @ApiProperty({ example: '09:00', description: 'Start time (HH:MM)' })
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({ example: '10:00', description: 'End time (HH:MM)' })
  @IsString()
  @IsNotEmpty()
  endTime: string;
}
