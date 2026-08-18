import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseQueryDto } from '../../common/dto/base-query.dto';
import { ClubCategory } from '../../core/database/generated';

export class QueryClubDto extends BaseQueryDto {
  @ApiPropertyOptional({ enum: ClubCategory })
  @IsEnum(ClubCategory)
  @IsOptional()
  category?: ClubCategory;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  is_active?: string;
}
