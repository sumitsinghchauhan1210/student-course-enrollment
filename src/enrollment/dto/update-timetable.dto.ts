import { PartialType } from '@nestjs/swagger';
import { CreateTimetableDto } from './create-timetable.dto';

export class UpdateTimetableBodyDto extends PartialType(CreateTimetableDto) {}
