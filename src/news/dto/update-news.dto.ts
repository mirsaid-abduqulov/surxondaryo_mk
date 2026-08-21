import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateNewsDto } from './create-news.dto';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { booleanOrUndefined } from 'src/common/transformers/boolean-transformer';
import { trimmedOrUndefined } from 'src/common/transformers/string-transformer';

export class UpdateNewsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Transform(trimmedOrUndefined)
  title_latin?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Transform(trimmedOrUndefined)
  title_cyril?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Transform(trimmedOrUndefined)
  title_ru?: string;


  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Transform(trimmedOrUndefined)
  content_latin?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Transform(trimmedOrUndefined)
  content_cyril?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Transform(trimmedOrUndefined)
  content_ru?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  cover_image?: any;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(booleanOrUndefined)
  is_public?: boolean;
}
