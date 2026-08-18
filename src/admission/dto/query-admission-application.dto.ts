import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { BaseQueryDto } from '../../common/dto/base-query.dto';
import { ApplicationStatus } from '../../core/database/generated';

export class QueryAdmissionApplicationDto extends BaseQueryDto {
  @ApiPropertyOptional({ enum: ApplicationStatus })
  @IsEnum(ApplicationStatus)
  @IsOptional()
  status?: ApplicationStatus;
}
