import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { CreateMediaAlbumDto } from './dto/create-media-album.dto';
import { UpdateMediaAlbumDto } from './dto/update-media-album.dto';
import { QueryMediaAlbumDto } from './dto/query-media-album.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles-auth-decorator';
import { UserRole } from 'src/core/database/generated';
import { MediaService } from './media-albums.service';
import { CreateMediaItemDto } from './dto/create-media-item.dto';
import { UpdateMediaItemOrderDto } from './dto/update-media-item.dto';

@ApiTags('Media (Mediya)')
@Controller('media-albums')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService
  ) { }

  // ============= ALBUM CRUD =============

  /**
   * Yangi album yaratish
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseInterceptors(FileInterceptor('cover_image'))
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Yangi mediya albomi yaratish' })
  @ApiResponse({ status: 201, description: 'Album muvaffaqiyatli yaratildi' })
  @ApiResponse({ status: 400, description: 'Validatsiya xatosi' })
  createAlbum(
    @Req() req: any,
    @Body() dto: CreateMediaAlbumDto,
    @UploadedFile() coverImage?: Express.Multer.File,
  ) {
    return this.mediaService.createAlbum(req.user.id, dto, coverImage);
  }

  /**
   * Barcha albumlarni olish (PUBLIC)
   */
  @Get()
  @ApiOperation({ summary: 'Barcha mediya albumlarini olish(public)' })
  @ApiResponse({ status: 200, description: 'Albumlar ro\'yxati' })
  findAll(@Query() query: QueryMediaAlbumDto) {
    query.is_public = true;
    return this.mediaService.findAll(query);
  }
  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Barcha mediya albumlarini olish(admin)' })
  @ApiResponse({ status: 200, description: 'Albumlar ro\'yxati' })
  findAllAdmin(@Query() query: QueryMediaAlbumDto) {
    return this.mediaService.findAll(query);
  }
  


  /**
   * Bitta albumni olish (PUBLIC)
   */
  @Get(':albumId')
  @ApiParam({ name: 'albumId', description: 'Album ID' })
  @ApiOperation({ summary: 'Bitta albumni va uning item larini olish(public)' })
  @ApiResponse({ status: 200, description: 'Album ma\'lumotlari + items' })
  @ApiResponse({ status: 404, description: 'Album topilmadi' })
  findOne(@Param('albumId') albumId: string) {
    return this.mediaService.findOne(albumId,true);
  }

  @Get('admin/:albumId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiParam({ name: 'albumId', description: 'Album ID' })
  @ApiOperation({ summary: 'Bitta albumni va uning item larini olish(admin)' })
  @ApiResponse({ status: 200, description: 'Album ma\'lumotlari + items' })
  @ApiResponse({ status: 404, description: 'Album topilmadi' })
  findOneAdmin(@Param('albumId') albumId: string) {
    return this.mediaService.findOne(albumId);
  }

  /**
   * Albumni yangilash (ADMIN)
   */
  @Patch(':albumId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseInterceptors(FileInterceptor('cover_image'))
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiParam({ name: 'albumId', description: 'Album ID' })
  @ApiOperation({ summary: 'Album ma\'lumotlarini yangilash' })
  @ApiResponse({ status: 200, description: 'Album muvaffaqiyatli yangilandi' })
  updateAlbum(
    @Param('albumId') albumId: string,
    @Body() dto: UpdateMediaAlbumDto,
    @UploadedFile() coverImage?: Express.Multer.File,
  ) {
    return this.mediaService.updateAlbum(albumId, dto, coverImage);
  }

  /**
   * Albumni o'chirish (ADMIN)
   */
  @Delete(':albumId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiParam({ name: 'albumId', description: 'Album ID' })
  @ApiOperation({ summary: 'Albumni va barcha item larini o\'chirish' })
  @ApiResponse({ status: 200, description: 'Album muvaffaqiyatli o\'chirildi' })
  removeAlbum(@Param('albumId') albumId: string) {
    return this.mediaService.removeAlbum(albumId);
  }

  // ============= MEDIA ITEMS =============

  /**
   * Album'ga item qo'shish (PHOTO/VIDEO/PRESENTATION)
   */
  @Post(':albumId/items')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiParam({ name: 'albumId', description: 'Album ID' })
  @ApiOperation({
    summary: 'Album\'ga item qo\'shish',
    description: `
      PHOTO: faqat file (PNG/JPEG/WebP, 5MB)
      VIDEO: faqat video_url
      PRESENTATION: video_url YOKI file (PDF/PPTX, 50MB)
    `,
  })
  @ApiResponse({ status: 201, description: 'Item muvaffaqiyatli qo\'shildi' })
  @ApiResponse({ status: 400, description: 'Type ga mos validatsiya xatosi' })
  addMediaItem(
    @Param('albumId') albumId: string,
    @Body() dto: CreateMediaItemDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.mediaService.addMediaItem(albumId, dto, file);
  }

  /**
   * Album'dagi barcha item larni olish (PUBLIC)
   */
  @Get(':albumId/items')
  @ApiParam({ name: 'albumId', description: 'Album ID' })
  @ApiOperation({ summary: 'Album\'dagi barcha item larni olish' })
  @ApiResponse({ status: 200, description: 'Item lar ro\'yxati' })
  @ApiResponse({ status: 404, description: 'Album topilmadi' })
  getAlbumItems(@Param('albumId') albumId: string) {
    return this.mediaService.getAlbumItems(albumId);
  }

  /**
   * Item tartib raqamini o'zgartirish (ADMIN)
   */
  @Patch(':albumId/items/:itemId/order')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiParam({ name: 'albumId', description: 'Album ID' })
  @ApiParam({ name: 'itemId', description: 'Item ID' })
  @ApiOperation({ summary: 'Item tartib raqamini o\'zgartirish' })
  @ApiResponse({ status: 200, description: 'Tartib muvaffaqiyatli o\'zgartirildi' })
  updateItemOrder(
    @Param('albumId') albumId: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateMediaItemOrderDto,
  ) {
    return this.mediaService.updateItemOrder(albumId, itemId, dto.order);
  }

  /**
   * Item'ni o'chirish (ADMIN)
   */
  @Delete(':albumId/items/:itemId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiParam({ name: 'albumId', description: 'Album ID' })
  @ApiParam({ name: 'itemId', description: 'Item ID' })
  @ApiOperation({ summary: 'Item\'ni o\'chirish' })
  @ApiResponse({ status: 200, description: 'Item muvaffaqiyatli o\'chirildi' })
  removeMediaItem(
    @Param('albumId') albumId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.mediaService.removeMediaItem(albumId, itemId);
  }
}