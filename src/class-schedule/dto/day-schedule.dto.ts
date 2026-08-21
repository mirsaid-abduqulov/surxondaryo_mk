import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { LessonSlotDto } from './lesson-slot.dto';

export class DayScheduleDto {
  @ApiPropertyOptional({ type: [LessonSlotDto], description: 'Dushanba kungi darslar' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LessonSlotDto)
  monday?: LessonSlotDto[];

  @ApiPropertyOptional({ type: [LessonSlotDto], description: 'Seshanba kungi darslar' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LessonSlotDto)
  tuesday?: LessonSlotDto[];

  @ApiPropertyOptional({ type: [LessonSlotDto], description: 'Chorshanba kungi darslar' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LessonSlotDto)
  wednesday?: LessonSlotDto[];

  @ApiPropertyOptional({ type: [LessonSlotDto], description: 'Payshanba kungi darslar' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LessonSlotDto)
  thursday?: LessonSlotDto[];

  @ApiPropertyOptional({ type: [LessonSlotDto], description: 'Juma kungi darslar' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LessonSlotDto)
  friday?: LessonSlotDto[];

  @ApiPropertyOptional({ type: [LessonSlotDto], description: 'Shanba kungi darslar' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LessonSlotDto)
  saturday?: LessonSlotDto[];
}
