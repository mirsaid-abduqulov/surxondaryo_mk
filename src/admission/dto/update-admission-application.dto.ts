import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApplicationStatus } from '../../core/database/generated';

export class UpdateAdmissionApplicationDto {
  @ApiPropertyOptional({ enum: ApplicationStatus })
  @IsEnum(ApplicationStatus)
  @IsOptional()
  status?: ApplicationStatus;

  @ApiPropertyOptional({ description: "Admin izohi" })
  @IsString()
  @IsOptional()
  admin_comment?: string;
}
