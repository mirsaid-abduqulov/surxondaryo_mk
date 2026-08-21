import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';
import { DocumentCategory } from '../../core/database/generated';

export class CreateNewsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => typeof value === 'string'&& value.trim()!='' ? value.trim() : null)
  title_latin: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => typeof value === 'string'&& value.trim()!='' ? value.trim() : null)
  title_cyril: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => typeof value === 'string'&& value.trim()!='' ? value.trim() : null)
  title_ru: string;

  
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => typeof value === 'string'&& value.trim()!='' ? value.trim() : null)
  content_latin: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => typeof value === 'string'&& value.trim()!='' ? value.trim() : null)
  content_cyril: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => typeof value === 'string'&& value.trim()!='' ? value.trim() : null)
  content_ru: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  cover_image?: any;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  is_public?: boolean;
  
}
