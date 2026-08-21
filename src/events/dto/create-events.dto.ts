import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { EventType } from '../../core/database/generated';
import { trimmedOrUndefined } from 'src/common/transformers/string-transformer';

export class CreateEventsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(trimmedOrUndefined)
  title_latin: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(trimmedOrUndefined)
  title_cyril: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(trimmedOrUndefined)
  title_ru: string;

  
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

 @ApiProperty({
    example: '2026-08-19',
    description: 'Tadbir sanasi (YYYY-MM-DD formatida)',
  })
  @IsNotEmpty()
  @IsDateString()
  event_date: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
    description: 'Cover image for the event',
  })
  cover_image?: Express.Multer.File;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  is_public?: boolean;

  @ApiPropertyOptional({ enum: EventType, default: EventType.SCHOOL_EVENT })
  @IsEnum(EventType)
  @IsOptional()
  type?: EventType;
}
