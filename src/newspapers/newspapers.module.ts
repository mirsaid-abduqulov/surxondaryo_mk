import { Module } from '@nestjs/common';
import { NewspapersService } from './newspapers.service';
import { NewspapersController } from './newspapers.controller';
import { StorageModule } from '../common/storage/storage.module';

@Module({
  imports: [StorageModule],
  controllers: [NewspapersController],
  providers: [NewspapersService],
})
export class NewspapersModule {}
