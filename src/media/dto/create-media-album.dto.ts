import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsEnum, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { MediaType } from '../../core/database/generated';
import { trimmedOrUndefined } from 'src/common/transformers/string-transformer';
import { booleanOrUndefined } from 'src/common/transformers/boolean-transformer';

export class CreateMediaAlbumDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(trimmedOrUndefined)
  title_latin: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(trimmedOrUndefined)
  title_cyril: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(trimmedOrUndefined)
  title_ru: string;

  @ApiProperty({ enum: MediaType })
  @IsNotEmpty()
  @IsEnum(MediaType)
  type: MediaType;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  cover_image?: any;

  @ApiPropertyOptional()
  @Transform(booleanOrUndefined)
  @IsBoolean()
  @IsOptional()
  is_public?: boolean=true;
}
