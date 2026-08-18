import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { WeekDay } from '../../core/database/generated';

export class CreateClassScheduleDto {
  @ApiProperty({ description: 'masalan "5-A", "9-B"' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  grade: string;

  @ApiProperty({ enum: WeekDay })
  @IsEnum(WeekDay)
  day: WeekDay;

  @ApiProperty({ description: 'Dars raqami', minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  lesson_number: number;

  @ApiProperty({ description: 'Fan nomi (lotin)' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  subject_latin: string;

  @ApiProperty({ description: 'Fan nomi (kirill)' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  subject_cyril: string;

  @ApiProperty({ description: 'Fan nomi (rus)' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  subject_ru: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  teacher_name?: string;

  @ApiPropertyOptional({ description: 'Xona raqami' })
  @IsString()
  @IsOptional()
  room?: string;

  @ApiProperty({ description: 'Boshlanish vaqti, masalan "08:30"' })
  @IsString()
  @IsNotEmpty()
  start_time: string;

  @ApiProperty({ description: 'Tugash vaqti, masalan "09:15"' })
  @IsString()
  @IsNotEmpty()
  end_time: string;
}
