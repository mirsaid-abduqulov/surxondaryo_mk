import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateHolidayScheduleDto {
  @ApiProperty({ description: 'Sarlavha (lotin)' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  title_latin: string;

  @ApiProperty({ description: 'Sarlavha (kirill)' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  title_cyril: string;

  @ApiProperty({ description: 'Sarlavha (rus)' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  title_ru: string;

  @ApiProperty({ description: 'Boshlanish sanasi (YYYY-MM-DD)', example: '2026-01-01' })
  @IsDateString()
  start_date: string;

  @ApiProperty({ description: 'Tugash sanasi (YYYY-MM-DD)', example: '2026-01-14' })
  @IsDateString()
  end_date: string;

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
}
