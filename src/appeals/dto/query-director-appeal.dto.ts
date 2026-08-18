import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { BaseQueryDto } from '../../common/dto/base-query.dto';
import { AppealStatus } from '../../core/database/generated';

export class QueryDirectorAppealDto extends BaseQueryDto {
  @ApiPropertyOptional({ enum: AppealStatus })
  @IsEnum(AppealStatus)
  @IsOptional()
  status?: AppealStatus;
}
