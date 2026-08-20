import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateDocumentsDto } from './create-documents.dto';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { DocumentCategory } from 'src/core/database/generated';

export class UpdateDocumentsDto extends PartialType(CreateDocumentsDto) {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  title_latin: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  title_cyril: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  title_ru: string;


  @ApiPropertyOptional({ enum: DocumentCategory, description: 'To\'garak kategoriyasi' })
  @IsEnum(DocumentCategory)
  @Transform(({ value }) => value === '' ? undefined : value)
  @IsOptional()
  category?: DocumentCategory;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
    description: 'Document file (PDF, DOC, DOCX, max 10MB)',
  })
  file?: Express.Multer.File;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => typeof value === 'string' ? value.toLowerCase() === 'true' : value)
  is_public?: boolean = false;
}
