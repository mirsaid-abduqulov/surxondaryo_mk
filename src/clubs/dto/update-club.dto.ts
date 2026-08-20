import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateClubDto } from './create-club.dto';
import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ClubCategory } from '../../core/database/generated';
import { ClubScheduleDto } from './schedule.dto';
import { BadRequestException } from '@nestjs/common';

export class UpdateClubDto {
    @ApiPropertyOptional({ description: "To'garak nomi (Lotin)" })
    @IsString()
    @IsOptional()
    name_latin?: string;

    @ApiPropertyOptional({ description: "To'garak nomi (Kirill)" })
    @IsString()
    @IsOptional()
    name_cyril?: string;

    @ApiPropertyOptional({ description: "To'garak nomi (Rus)" })
    @IsString()
    @IsOptional()
    name_ru?: string;

    @ApiPropertyOptional({ enum: ClubCategory, description: 'To\'garak kategoriyasi' })
    @IsEnum(ClubCategory)
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsOptional()
    category?: ClubCategory;

    @ApiPropertyOptional({ required: false, description: "Boshlanish sanasi (YYYY-MM-DD)" })
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsOptional()
    @IsDateString()
    start_date?: string;

    @ApiPropertyOptional({ required: false, description: "Tugash sanasi (YYYY-MM-DD)" })
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsOptional()
    @IsDateString()
    end_date?: string;

    @ApiPropertyOptional({ required: false, description: "Tavsif (Lotin)" })
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsOptional()
    @IsString()
    description_latin?: string;

    @ApiPropertyOptional({ required: false, description: "Tavsif (Kirill)" })
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsOptional()
    @IsString()
    description_cyril?: string;

    @ApiPropertyOptional({ required: false, description: "Tavsif (Rus)" })
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsOptional()
    @IsString()
    description_ru?: string;

    @ApiPropertyOptional({ required: false, description: "Murabbiy yoki rahbar ismi" })
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsOptional()
    @IsString()
    supervisor_name?: string;

    @ApiPropertyOptional({ required: false, description: "Yosh toifasi (Masalan: 5-7-sinflar)" })
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsOptional()
    @IsString()
    age_group?: string;

    @ApiPropertyOptional({ required: false, description: "Manzil yoki o'tkazilish joyi" })
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsOptional()
    @IsString()
    location?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Transform(({ value }) => {
        if (value === undefined || value === null) return undefined;
        return value === 'true' || value === true || Number(value) === 1;
    })
    @IsBoolean()
    is_active?: boolean;

    @ApiPropertyOptional({
        description: "Jadval (JSON string sifatida yuboriladi)",
        example: '{"monday":[{"start":"14:00","end":"16:00","room":"101"}]}'
    })
    @Transform(({ value }) => {
        if (!value || value === '' || value === 'null' || value === 'undefined') return undefined;
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            } catch (error) {
                throw new BadRequestException("schedule formati noto'g'ri (JSON bo'lishi kerak)");
            }
        }
        return value;
    })
    @IsObject()
    @IsOptional()
    schedule?: Record<string, any>;
}
