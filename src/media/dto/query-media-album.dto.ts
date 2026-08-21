import { BaseQueryDto } from '../../common/dto/base-query.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { MediaType } from '../../core/database/generated';
import { Transform } from 'class-transformer';
import { booleanOrUndefined } from 'src/common/transformers/boolean-transformer';

export class QueryMediaAlbumDto extends BaseQueryDto {
  @ApiPropertyOptional({ enum: MediaType })
  @IsOptional()
  @IsEnum(MediaType)
  type?: MediaType;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(booleanOrUndefined)
  @IsBoolean()
  is_public?: boolean;
}
