import { PartialType } from '@nestjs/swagger';
import { CreateHolidayScheduleDto } from './create-holiday-schedule.dto';

export class UpdateHolidayScheduleDto extends PartialType(CreateHolidayScheduleDto) {}
