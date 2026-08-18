import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { CanteenMenuService } from './canteen-menu.service';
import { CreateCanteenMenuDto } from './dto/create-canteen-menu.dto';
import { UpdateCanteenMenuDto } from './dto/update-canteen-menu.dto';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles-auth-decorator';
import { UserRole } from '../core/database/generated';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CanteenMenuQueryDto } from './dto/canteen-menu-query.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter, imageLimits } from '../common/storage/multer.config';

@ApiTags('Canteen Menu (Oshxona Menyusi)')
@Controller('canteen-menu')
export class CanteenMenuController {
  constructor(private readonly canteenMenuService: CanteenMenuService) {}

  @Get('public/active')
  @ApiOperation({ summary: 'Faol oshxona menyusini olish (Public)' })
  findOneActive() {
    return this.canteenMenuService.findOneActive();
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Yangi oshxona menyusini yaratish (Admin)' })
  create(@Body() createCanteenMenuDto: CreateCanteenMenuDto) {
    return this.canteenMenuService.create(createCanteenMenuDto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Barcha oshxona menyularini ro`yxati (Admin)' })
  findAll(@Query() query: CanteenMenuQueryDto) {
    return this.canteenMenuService.findAll(query);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Menyuni ID bo`yicha olish (Admin)' })
  findOne(@Param('id') id: string) {
    return this.canteenMenuService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Oshxona menyusini yangilash (Admin)' })
  update(@Param('id') id: string, @Body() updateCanteenMenuDto: UpdateCanteenMenuDto) {
    return this.canteenMenuService.update(id, updateCanteenMenuDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Oshxona menyusini o`chirish (Admin)' })
  remove(@Param('id') id: string) {
    return this.canteenMenuService.remove(id);
  }

  @Patch(':id/activate')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Bitta menyuni bitta tugma bilan faol holatga o`tkazish (Admin)' })
  activate(@Param('id') id: string) {
    return this.canteenMenuService.activate(id);
  }

  @Patch(':id/foods/:foodItemId/image')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Bitta taomga rasm yuklash yoki almashtirish (Admin)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: imageFileFilter,
      limits: imageLimits,
    }),
  )
  updateFoodImage(
    @Param('id') id: string,
    @Param('foodItemId') foodItemId: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (!image) {
      throw new BadRequestException('Rasm yuklanmagan');
    }
    return this.canteenMenuService.updateFoodImage(id, foodItemId, image);
  }
}
