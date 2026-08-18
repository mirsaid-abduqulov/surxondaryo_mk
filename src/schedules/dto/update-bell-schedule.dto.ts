import { PartialType } from '@nestjs/swagger';
import { CreateBellScheduleDto } from './create-bell-schedule.dto';

export class UpdateBellScheduleDto extends PartialType(CreateBellScheduleDto) {}
