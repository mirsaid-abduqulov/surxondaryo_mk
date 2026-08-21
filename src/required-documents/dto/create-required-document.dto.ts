import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { trimmedOrUndefined } from 'src/common/transformers/string-transformer';
import { booleanOrUndefined } from 'src/common/transformers/boolean-transformer';

export class CreateRequiredDocumentDto {
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

  @ApiPropertyOptional({ default: 0 })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  order?: number;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  @Transform(booleanOrUndefined)
  is_active?: boolean;
}
