import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';
import { BaseQueryDto } from '../../common/dto/base-query.dto';

export class CanteenMenuQueryDto extends BaseQueryDto {
  @ApiPropertyOptional({ description: 'Filtrlash uchun boshlanish sanasi (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiPropertyOptional({ description: 'Filtrlash uchun tugash sanasi (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  end_date?: string;
}
