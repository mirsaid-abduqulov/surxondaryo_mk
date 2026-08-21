import { Module } from '@nestjs/common';
import { MediaService } from './media-albums.service';
import { MediaController } from './media-albums.controller';

@Module({
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
