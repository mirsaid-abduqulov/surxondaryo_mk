import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseQueryDto } from '../../common/dto/base-query.dto';
import { ClubCategory, WeekDay } from '../../core/database/generated';

export class ClubQueryDto extends BaseQueryDto {
  @ApiProperty({ required: false, enum: ClubCategory })
  @IsOptional()
  @IsEnum(ClubCategory)
  category?: ClubCategory;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  age_group?: string;


  
  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true' ? true : value === 'false' ? false : value)
  @IsBoolean()
  is_active?: boolean;

  @ApiProperty({required:false,enum:WeekDay})
  @IsString()
  @IsEnum(WeekDay)
  @IsOptional()
  weekday?: WeekDay;
}
