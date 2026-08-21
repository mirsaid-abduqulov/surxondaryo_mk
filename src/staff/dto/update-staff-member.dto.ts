import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateStaffMemberDto } from './create-staff-member.dto';
import { IsBoolean, IsEmail, IsEnum, IsInt, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { StaffCategory } from 'src/core/database/generated';
import { booleanOrUndefined } from 'src/common/transformers/boolean-transformer';
import { trimmedOrUndefined } from 'src/common/transformers/string-transformer';

export class UpdateStaffMemberDto {
    @ApiPropertyOptional()
      @IsString()
      @IsOptional()
      @Transform(trimmedOrUndefined)
      full_name_latin?: string;
    
      @ApiPropertyOptional()
      @IsString()
      @IsOptional()
      @Transform(trimmedOrUndefined)
      full_name_cyril?: string;
    
      @ApiPropertyOptional()
      @IsString()
      @IsOptional()
      @Transform(trimmedOrUndefined)
      full_name_ru?: string;
    
      @ApiPropertyOptional({ enum: StaffCategory })
      @IsOptional()
      @IsEnum(StaffCategory)
      category?: StaffCategory;
    
      @ApiPropertyOptional()
      @IsString()
      @IsOptional()
      @Transform(trimmedOrUndefined)
      position_latin?: string;
    
      @ApiPropertyOptional()
      @IsString()
      @IsOptional()
      @Transform(trimmedOrUndefined)
      position_cyril?: string;
    
      @ApiPropertyOptional()
      @IsString()
      @IsOptional()
      @Transform(trimmedOrUndefined)
      position_ru?: string;
    
      @ApiPropertyOptional()
      @IsString()
      @IsOptional()
      @Transform(trimmedOrUndefined)
      subject_latin?: string;
    
      @ApiPropertyOptional()
      @IsString()
      @IsOptional()
      @Transform(trimmedOrUndefined)
      subject_cyril?: string;
    
      @ApiPropertyOptional()
      @IsString()
      @IsOptional()
      subject_ru?: string;
    
      @ApiPropertyOptional()
      @IsString()
      @IsOptional()
      @Transform(trimmedOrUndefined)
      bio_latin?: string;
    
      @ApiPropertyOptional()
      @IsString()
      @IsOptional()
      @Transform(trimmedOrUndefined)
      bio_cyril?: string;
    
      @ApiPropertyOptional()
      @IsString()
      @IsOptional()
      @Transform(trimmedOrUndefined)
      bio_ru?: string;
    
      @ApiPropertyOptional()
      @IsPhoneNumber()
      @IsOptional()
      @Transform(trimmedOrUndefined)
      phone?: string;
    
      @ApiPropertyOptional()
      @IsEmail()
      @IsOptional()
      @Transform(trimmedOrUndefined)
      email?: string;
    
      @ApiPropertyOptional()
      @IsString()
      @IsOptional()
      @Transform(trimmedOrUndefined)
      reception_days?: string;
    
      @ApiPropertyOptional()
      @IsString()
      @IsOptional()
      @Transform(trimmedOrUndefined)
      degree_latin?: string;
    
      @ApiPropertyOptional()
      @IsString()
      @Transform(trimmedOrUndefined)
      @IsOptional()
      degree_cyril?: string;
    
      @ApiPropertyOptional()
      @IsString()
      @IsOptional()
      @Transform(trimmedOrUndefined)
      degree_ru?: string;
    
      @ApiPropertyOptional({ default: 0 })
      @IsInt()
      @IsOptional()
      @Transform(({ value }) => Number(value))
      order?: number;
    
      @ApiPropertyOptional({ default: true })
      @IsBoolean()
      @IsOptional()
      @Transform(booleanOrUndefined)
      is_active?: boolean;
    
      @ApiPropertyOptional({
        type: 'string',
        format: 'binary',
        description: 'Xodim rasmi (JPEG, PNG, WebP, max 5MB)',
      })
      @IsOptional()
      photo?: Express.Multer.File;  
}
