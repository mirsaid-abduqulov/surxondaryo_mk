import { BaseQueryDto } from '../../common/dto/base-query.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { EventType } from '../../core/database/generated';

export class QueryEventsDto extends BaseQueryDto {

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  upcoming?: boolean;

  @ApiPropertyOptional({ enum: EventType })
  @IsOptional()
  type?: EventType;
}
