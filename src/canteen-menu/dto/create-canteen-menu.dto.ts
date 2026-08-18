import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsOptional, ValidateNested } from 'class-validator';
import { DayMenuDto } from './day-menu.dto';

export class CreateCanteenMenuDto {
  @ApiProperty({ description: 'Menyu boshlanish sanasi (YYYY-MM-DD)' })
  @IsDateString()
  start_date: string;

  @ApiProperty({ required: false, description: 'Menyu tugash sanasi (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiProperty({ required: false, default: false, description: 'Menyu faollik holati' })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiProperty({ required: false, type: () => DayMenuDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => DayMenuDto)
  monday?: DayMenuDto;

  @ApiProperty({ required: false, type: () => DayMenuDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => DayMenuDto)
  tuesday?: DayMenuDto;

  @ApiProperty({ required: false, type: () => DayMenuDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => DayMenuDto)
  wednesday?: DayMenuDto;

  @ApiProperty({ required: false, type: () => DayMenuDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => DayMenuDto)
  thursday?: DayMenuDto;

  @ApiProperty({ required: false, type: () => DayMenuDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => DayMenuDto)
  friday?: DayMenuDto;

  @ApiProperty({ required: false, type: () => DayMenuDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => DayMenuDto)
  saturday?: DayMenuDto;
}
