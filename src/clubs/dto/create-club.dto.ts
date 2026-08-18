import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ClubCategory } from '../../core/database/generated';

export class CreateClubDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  name_latin: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  name_cyril: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  name_ru: string;

  @ApiProperty({ enum: ClubCategory })
  @IsEnum(ClubCategory)
  category: ClubCategory;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  description_latin?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  description_cyril?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  description_ru?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  supervisor_name?: string;

  @ApiPropertyOptional({ description: 'masalan "5-7-sinflar"' })
  @IsString()
  @IsOptional()
  age_group?: string;

  @ApiPropertyOptional({ description: 'masalan "Dush, Chor, Juma 15:00-16:30"' })
  @IsString()
  @IsOptional()
  schedule_latin?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  schedule_cyril?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  schedule_ru?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  is_active?: boolean;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: "To'garak muqovasi (JPEG, PNG, WebP, max 5MB)",
  })
  @IsOptional()
  cover_image?: Express.Multer.File;
}
