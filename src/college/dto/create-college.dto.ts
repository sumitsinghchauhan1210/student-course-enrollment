import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCollegeDto {
  @ApiProperty({ example: 'MIT' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
