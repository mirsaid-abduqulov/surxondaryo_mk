import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseQueryDto } from '../../common/dto/base-query.dto';
import { StaffCategory } from '../../core/database/generated';

export class QueryStaffMemberDto extends BaseQueryDto {
  @ApiPropertyOptional({ enum: StaffCategory })
  @IsEnum(StaffCategory)
  @IsOptional()
  category?: StaffCategory;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  is_active?: string;
}
