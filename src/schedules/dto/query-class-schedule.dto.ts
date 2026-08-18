import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseQueryDto } from '../../common/dto/base-query.dto';
import { WeekDay } from '../../core/database/generated';

export class QueryClassScheduleDto extends BaseQueryDto {
  @ApiPropertyOptional({ description: 'masalan "5-A"' })
  @IsString()
  @IsOptional()
  grade?: string;

  @ApiPropertyOptional({ enum: WeekDay })
  @IsEnum(WeekDay)
  @IsOptional()
  day?: WeekDay;
}
