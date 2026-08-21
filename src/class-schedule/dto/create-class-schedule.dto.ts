import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DayScheduleDto } from './day-schedule.dto';

export class CreateClassScheduleDto {
  @ApiProperty({ description: 'Sinf nomi', example: '5-A' })
  @IsString()
  @IsNotEmpty()
  grade: string;

  @ApiPropertyOptional({ description: 'Boshlanish sanasi' })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiPropertyOptional({ description: 'Tugash sanasi' })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiPropertyOptional({ description: 'Aktivlik holati', default: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional({ type: DayScheduleDto, description: 'Haftalik dars jadvali' })
  @IsOptional()
  @ValidateNested()
  @Type(() => DayScheduleDto)
  schedule?: DayScheduleDto;
}
