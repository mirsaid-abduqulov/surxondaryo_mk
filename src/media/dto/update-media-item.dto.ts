import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { Transform } from 'class-transformer';
 
export class UpdateMediaItemOrderDto {
  @ApiProperty({
    type: 'integer',
    description: 'Yangi tartib raqami',
    example: 2,
  })
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  @Transform(({ value }) => Number(value))
  order: number;
}