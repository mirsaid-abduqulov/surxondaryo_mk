import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';
 
export class CreateMediaItemDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Fayl (PHOTO uchun rasm, PRESENTATION uchun PDF/PPTX)',
  })
  @IsOptional()
  file?: Express.Multer.File;
 
  @ApiProperty({
    required: false,
    description: 'Video URL (VIDEO va PRESENTATION type\'da)',
    example: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
  })
  @IsUrl()
  @IsOptional()
  @Transform(({ value }) => value?.trim?.() || undefined)
  video_url?: string;
 
  @ApiProperty({
    required: false,
    type: 'integer',
    default: 0,
    description: 'Tartib raqami',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  @Min(0)
  @Transform(({ value }) => (value === '' || value === null ? 0 : Number(value)))
  order?: number;
}