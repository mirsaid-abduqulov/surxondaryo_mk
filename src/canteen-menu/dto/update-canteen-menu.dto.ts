import { PartialType } from '@nestjs/swagger';
import { CreateCanteenMenuDto } from './create-canteen-menu.dto';

export class UpdateCanteenMenuDto extends PartialType(CreateCanteenMenuDto) {}
