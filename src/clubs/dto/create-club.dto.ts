import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ClubCategory } from '../../core/database/generated';
import { ClubScheduleDto } from './schedule.dto';
import { BadRequestException } from '@nestjs/common';

export class CreateClubDto {
  @ApiProperty({ description: "To'garak nomi (Lotin)" })
  @IsString()
  @IsNotEmpty()
  name_latin: string;

  @ApiProperty({ description: "To'garak nomi (Kirill)" })
  @IsString()
  @IsNotEmpty()
  name_cyril: string;

  @ApiProperty({ description: "To'garak nomi (Rus)" })
  @IsString()
  @IsNotEmpty()
  name_ru: string;

  @ApiProperty({ enum: ClubCategory, description: 'To\'garak kategoriyasi' })
  @IsEnum(ClubCategory)
  category: ClubCategory;

  @ApiProperty({ required: false, description: "Boshlanish sanasi (YYYY-MM-DD)" })
  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  @IsDateString()
  start_date?: string;

  @ApiProperty({ required: false, description: "Tugash sanasi (YYYY-MM-DD)" })
  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  @IsDateString()
  end_date?: string;

  @ApiProperty({ required: false, description: "Tavsif (Lotin)" })
  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  @IsString()
  description_latin?: string;

  @ApiProperty({ required: false, description: "Tavsif (Kirill)" })
  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  @IsString()
  description_cyril?: string;

  @ApiProperty({ required: false, description: "Tavsif (Rus)" })
  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  @IsString()
  description_ru?: string;

  @ApiProperty({ required: false, description: "Murabbiy yoki rahbar ismi" })
  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  @IsString()
  supervisor_name?: string;

  @ApiProperty({ required: false, description: "Yosh toifasi (Masalan: 5-7-sinflar)" })
  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  @IsString()
  age_group?: string;

  @ApiProperty({ required: false, description: "Manzil yoki o'tkazilish joyi" })
  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  @IsString()
  location?: string;

  @ApiProperty({ required: false, description: "Faollik holati (Public da ko'rinishi)" })
  @IsOptional()
  @Transform(({ value }) => value === 'true' ? true : value === 'false' ? false : value)
  @IsBoolean()
  is_active?: boolean;

  @ApiProperty({ required: false, type: () => ClubScheduleDto, description: "Jadval (JSON string sifatida yuboriladi)" })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '') return undefined;
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (error) {
        throw new BadRequestException("schedule format noto'g'ri (JSON bo'lishi kerak)");
      }
    }
    return value;
  })
  @ValidateNested()
  @Type(() => ClubScheduleDto)
  schedule?: ClubScheduleDto;
}
