import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { trimmedOrUndefined } from 'src/common/transformers/string-transformer';
import { dateOrUndefined } from 'src/common/transformers/date-trimmed-transformer';

export class CreateMeetingDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(trimmedOrUndefined)
  title_latin: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(trimmedOrUndefined)
  title_cyril: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(trimmedOrUndefined)
  title_ru: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Transform(trimmedOrUndefined)
  description_latin?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Transform(trimmedOrUndefined)
  description_cyril?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Transform(trimmedOrUndefined)
  description_ru?: string;

  @ApiPropertyOptional({ description: "Sinf (bo'sh bo'lsa - umumiy uchrashuv)" })
  @IsString()
  @IsOptional()
  grade?: string;

  @ApiProperty()
  @IsDateString()
  @Transform(dateOrUndefined)
  meeting_date: string;

  @ApiPropertyOptional({ description: 'Joyi' })
  @IsString()
  @IsOptional()
  @Transform(trimmedOrUndefined)
  location?: string;
}
