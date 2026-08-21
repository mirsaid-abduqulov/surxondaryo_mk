import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { StorageModule } from '../common/storage/storage.module';
import { ClassScheduleModule } from '../class-schedule/class-schedule.module';

@Module({
  imports: [StorageModule, ClassScheduleModule],
  controllers: [StaffController],
  providers: [StaffService],
})
export class StaffModule {}
