import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';
import { booleanOrUndefined } from 'src/common/transformers/boolean-transformer';
import { dateOrUndefined } from 'src/common/transformers/date-trimmed-transformer';
import { trimmedOrUndefined } from 'src/common/transformers/string-transformer';

export class UpdateEventsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Transform(trimmedOrUndefined)
  title_latin?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Transform(trimmedOrUndefined)
  title_cyril?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Transform(trimmedOrUndefined)
  title_ru?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Transform(trimmedOrUndefined)
  description_latin?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Transform(trimmedOrUndefined)
  description_cyril?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Transform(trimmedOrUndefined)
  description_ru?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Transform(trimmedOrUndefined)
  location_latin?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Transform(trimmedOrUndefined)
  location_cyril?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Transform(trimmedOrUndefined)
  location_ru?: string;

  @ApiPropertyOptional({
    example: '2026-08-19',
    description: 'Tadbir sanasi (YYYY-MM-DD formatida)',
  })
  @IsOptional()
  @IsDateString()
  @Transform(dateOrUndefined)
  event_date?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Cover image for the event',
  })
  cover_image?: Express.Multer.File;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(booleanOrUndefined)
  is_public?: boolean;
}