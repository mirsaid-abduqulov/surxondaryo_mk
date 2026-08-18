import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { BannersService } from './banners.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles-auth-decorator';
import { UserRole } from '../core/database/generated';
import { BaseQueryDto } from '../common/dto/base-query.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter, imageLimits } from '../common/storage/multer.config';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { IsActiveDto } from './dto/is_active.dto';
import { QueryBannerDto } from './dto/get-all-querry.dto';

@ApiTags('Banners(Bannerlar)')
@Controller('banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) { }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new banner (Admin only)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image_file', {
    fileFilter: imageFileFilter,
    limits: imageLimits,
  }))
  create(
    @Body() createBannerDto: CreateBannerDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (!image) throw new BadRequestException('Image is required');
    return this.bannersService.create(createBannerDto, image);
  }

  @Get("public")
  @ApiOperation({ summary: 'Get all active banners (Active only)' })
  findAllPublic(@Query() query: BaseQueryDto) {
    return this.bannersService.findAll(query, true);
  }

  @Get('public/:id')
  @ApiOperation({ summary: 'Get a banner by ID (Admin/SuperAdmin only)' })
  findOnePublic(@Param('id') id: string) {
    return this.bannersService.findOne(id, true);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiQuery({ name: 'is_active', required: false, type: Boolean })
  @ApiOperation({ summary: 'Get all banners (Admin/SuperAdmin only)' })
  findAll(@Query() query: QueryBannerDto, @Query() is_active?: boolean) {
    return this.bannersService.findAll(query, is_active);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get a banner by ID (Admin/SuperAdmin only)' })
  findOne(@Param('id') id: string) {
    return this.bannersService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update a banner (Admin only)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image_file', {
    fileFilter: imageFileFilter,
    limits: imageLimits,
  }))
  update(
    @Param('id') id: string,
    @Body() updateBannerDto: UpdateBannerDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.bannersService.update(id, updateBannerDto, image);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a banner (Admin only)' })
  remove(@Param('id') id: string) {
    return this.bannersService.remove(id);
  }

  @Patch(':id/active')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update banner active status (Admin only)' })
  updateIsActive(@Param('id') id: string, @Body() dto: IsActiveDto) {
    return this.bannersService.updateIsActive(id, dto);
  }
}
