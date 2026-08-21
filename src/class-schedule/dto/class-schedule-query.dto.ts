import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class ClassScheduleQueryDto {
  @ApiPropertyOptional({ description: 'Sinf nomi bo\'yicha filter', example: '5-A' })
  @IsOptional()
  @IsString()
  grade?: string;

  @ApiPropertyOptional({ description: 'Aktivlik holati bo\'yicha filter', type: Boolean })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return value;
  })
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional({ description: 'Sahifa raqami', default: 1 })
  @IsOptional()
  page?: string;

  @ApiPropertyOptional({ description: 'Sahifadagi elementlar soni', default: 10 })
  @IsOptional()
  limit?: string;
}
