import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Matches, Min } from 'class-validator';

export class LessonSlotDto {
  @ApiProperty({ description: 'Dars raqami (masalan, 1, 2, 3)', example: 1 })
  @IsInt()
  @Min(1)
  lesson_number: number;

  @ApiProperty({ description: 'Fan nomi (lotin)', example: 'Matematika' })
  @IsString()
  @IsNotEmpty()
  subject_latin: string;

  @ApiProperty({ description: 'Fan nomi (kirill)', example: 'Математика' })
  @IsString()
  @IsNotEmpty()
  subject_cyril: string;

  @ApiProperty({ description: 'Fan nomi (rus)', example: 'Математика' })
  @IsString()
  @IsNotEmpty()
  subject_ru: string;

  @ApiPropertyOptional({ description: 'Oqituvchi ID si (StaffMember id)', example: 'uuid-string' })
  @IsOptional()
  @IsUUID()
  teacher_id?: string;

  @ApiPropertyOptional({ description: 'Xona raqami', example: '101' })
  @IsOptional()
  @IsString()
  room?: string;

  @ApiProperty({ description: 'Boshlanish vaqti (HH:mm)', example: '08:30' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'Vaqt HH:mm formatida bolishi kerak' })
  start_time: string;

  @ApiProperty({ description: 'Tugash vaqti (HH:mm)', example: '09:15' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'Vaqt HH:mm formatida bolishi kerak' })
  end_time: string;
}
