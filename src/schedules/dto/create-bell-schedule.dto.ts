import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateBellScheduleDto {
  @ApiProperty({ description: 'Dars raqami', minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  lesson_number: number;

  @ApiProperty({ description: 'Boshlanish vaqti, masalan "08:00"' })
  @IsString()
  @IsNotEmpty()
  start_time: string;

  @ApiProperty({ description: 'Tugash vaqti, masalan "08:45"' })
  @IsString()
  @IsNotEmpty()
  end_time: string;

  @ApiPropertyOptional({ description: 'Tanaffus davomiyligi (daqiqada)' })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  break_minutes?: number;

  @ApiPropertyOptional({ description: '1-smena yoki 2-smena', default: 1 })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  shift?: number;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  is_active?: boolean;
}
