import { Module } from '@nestjs/common';
import { CanteenMenuService } from './canteen-menu.service';
import { CanteenMenuController } from './canteen-menu.controller';

@Module({
  controllers: [CanteenMenuController],
  providers: [CanteenMenuService],
})
export class CanteenMenuModule {}
