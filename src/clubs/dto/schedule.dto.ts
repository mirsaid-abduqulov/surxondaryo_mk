import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, Matches, ValidateNested } from 'class-validator';

export class ScheduleSlotDto {
  @ApiProperty({ description: 'Boshlanish vaqti (Masalan: 08:00)' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: "Vaqt formati no'to'g'ri (HH:MM bo'lishi kerak)" })
  start: string;

  @ApiProperty({ description: 'Tugash vaqti (Masalan: 09:00)' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: "Vaqt formati no'to'g'ri (HH:MM bo'lishi kerak)" })
  end: string;

  @ApiProperty({ required: false, description: 'Xona yoki joy (Masalan: 101-xona)' })
  @IsOptional()
  @IsString()
  room?: string;
}

export class ClubScheduleDto {
  @ApiProperty({ required: false, type: () => [ScheduleSlotDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleSlotDto)
  monday?: ScheduleSlotDto[];

  @ApiProperty({ required: false, type: () => [ScheduleSlotDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleSlotDto)
  tuesday?: ScheduleSlotDto[];

  @ApiProperty({ required: false, type: () => [ScheduleSlotDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleSlotDto)
  wednesday?: ScheduleSlotDto[];

  @ApiProperty({ required: false, type: () => [ScheduleSlotDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleSlotDto)
  thursday?: ScheduleSlotDto[];

  @ApiProperty({ required: false, type: () => [ScheduleSlotDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleSlotDto)
  friday?: ScheduleSlotDto[];

  @ApiProperty({ required: false, type: () => [ScheduleSlotDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleSlotDto)
  saturday?: ScheduleSlotDto[];
}

export class UpdateScheduleDayDto {
  @ApiProperty({ type: () => [ScheduleSlotDto], description: 'Kun bo\'yicha jadval ro\'yxati' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleSlotDto)
  slots: ScheduleSlotDto[];
}
