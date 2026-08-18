import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class UpdateNewspaperDto {
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  title_latin?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  title_cyril?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  title_ru?: string;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  issue_number?: number;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Gazeta muqovasi (JPEG, PNG, WebP, max 5MB)',
  })
  @IsOptional()
  cover_image?: Express.Multer.File;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Yangi gazeta PDF fayli (max 20MB)',
  })
  @IsOptional()
  file?: Express.Multer.File;
}
