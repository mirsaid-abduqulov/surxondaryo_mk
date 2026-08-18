import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { StaffCategory } from '../../core/database/generated';

export class CreateStaffMemberDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  full_name_latin: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  full_name_cyril: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  full_name_ru: string;

  @ApiProperty({ enum: StaffCategory })
  @IsEnum(StaffCategory)
  category: StaffCategory;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  position_latin: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  position_cyril: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  position_ru: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  subject_latin?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  subject_cyril?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  subject_ru?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  bio_latin?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  bio_cyril?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  bio_ru?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  reception_days?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  degree_latin?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  degree_cyril?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  degree_ru?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  order?: number;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  is_active?: boolean;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Xodim rasmi (JPEG, PNG, WebP, max 5MB)',
  })
  @IsOptional()
  photo?: Express.Multer.File;
}
