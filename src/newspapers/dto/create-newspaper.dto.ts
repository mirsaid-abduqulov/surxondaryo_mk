import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateNewspaperDto {
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

  @ApiPropertyOptional({ description: "Son raqami", example: 12 })
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

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Gazeta PDF fayli (max 20MB)',
  })
  file: Express.Multer.File;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  is_public?: boolean;
}
