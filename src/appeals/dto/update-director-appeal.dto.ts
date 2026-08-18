import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AppealStatus } from '../../core/database/generated';

export class UpdateDirectorAppealDto {
  @ApiPropertyOptional({ enum: AppealStatus })
  @IsEnum(AppealStatus)
  @IsOptional()
  status?: AppealStatus;

  @ApiPropertyOptional({ description: 'Javob matni' })
  @IsString()
  @IsOptional()
  answer?: string;
}
