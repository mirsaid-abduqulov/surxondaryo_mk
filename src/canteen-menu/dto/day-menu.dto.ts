import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, Matches, ValidateNested } from 'class-validator';

export class CanteenFoodItemDto {
  @ApiProperty({ required: false, description: 'Server tomonidan avtomatik yaratiladi, yuborish shart emas' })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({ description: 'Taom nomi (lotin)' })
  @IsString()
  @IsNotEmpty()
  name_latin: string;

  @ApiProperty({ description: 'Taom nomi (kirill)' })
  @IsString()
  @IsNotEmpty()
  name_cyril: string;

  @ApiProperty({ description: 'Taom nomi (rus)' })
  @IsString()
  @IsNotEmpty()
  name_ru: string;

  @ApiProperty({ required: false, description: 'Rasm URL (faqat rasm yuklash endpointi orqali o`rnatiladi)' })
  @IsOptional()
  @IsString()
  image_url?: string;
}

export class MealSlotDto {
  @ApiProperty({ description: 'Boshlanish vaqti (HH:mm formatida)', example: '08:00' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'start_time HH:mm formatida bo`lishi kerak' })
  start_time: string;

  @ApiProperty({ description: 'Tugash vaqti (HH:mm formatida)', example: '08:30' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'end_time HH:mm formatida bo`lishi kerak' })
  end_time: string;

  @ApiProperty({ type: [CanteenFoodItemDto], description: 'Taomlar ro`yxati' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CanteenFoodItemDto)
  foods: CanteenFoodItemDto[];
}

export class DayMenuDto {
  @ApiProperty({ required: false, type: () => MealSlotDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => MealSlotDto)
  breakfast?: MealSlotDto;

  @ApiProperty({ required: false, type: () => MealSlotDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => MealSlotDto)
  lunch?: MealSlotDto;

  @ApiProperty({ required: false, type: () => MealSlotDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => MealSlotDto)
  snack?: MealSlotDto;
}
