import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateAdmissionApplicationDto {
  @ApiProperty({ description: "O'quvchi to'liq ismi" })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  student_full_name: string;

  @ApiProperty({ description: "Tug'ilgan sana (YYYY-MM-DD)", example: '2019-05-15' })
  @IsDateString()
  birth_date: string;

  @ApiProperty({ description: "Qabul qilinayotgan sinf", example: '1' })
  @IsString()
  @IsNotEmpty()
  grade_applying: string;

  @ApiProperty({ description: "Ota-ona to'liq ismi" })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  parent_full_name: string;

  @ApiProperty({ description: 'Ota-ona telefoni' })
  @IsString()
  @IsNotEmpty()
  parent_phone: string;

  @ApiPropertyOptional({ description: 'Ota-ona emaili' })
  @IsEmail()
  @IsOptional()
  parent_email?: string;

  @ApiPropertyOptional({ description: 'Yashash manzili' })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  address?: string;

  @ApiPropertyOptional({ description: "Oldingi maktab (bo'lsa)" })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  previous_school?: string;

  @ApiPropertyOptional({ description: "Qo'shimcha ma'lumot yoki so'rov" })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  message?: string;
}
