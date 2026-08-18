import { Module } from '@nestjs/common';
import { RequiredDocumentsService } from './required-documents.service';
import { RequiredDocumentsController } from './required-documents.controller';

@Module({
  controllers: [RequiredDocumentsController],
  providers: [RequiredDocumentsService],
})
export class RequiredDocumentsModule {}
