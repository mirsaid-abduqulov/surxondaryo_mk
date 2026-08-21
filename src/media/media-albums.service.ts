import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../core/database/prisma.service';
import { StorageService } from '../common/storage/storage.service';
import { CreateMediaAlbumDto } from './dto/create-media-album.dto';
import { UpdateMediaAlbumDto } from './dto/update-media-album.dto';
import { QueryMediaAlbumDto } from './dto/query-media-album.dto';
import {
  buildPaginationParams,
  buildPaginatedResponse,
} from '../common/helpers/pagination.helper';
import { buildMultilangSearchWhere } from 'src/common/helpers/multilang-search.helper';
import { CreateMediaItemDto } from './dto/create-media-item.dto';
import { MediaType } from 'src/core/database/generated';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) { }

  // ============= ALBUM CRUD =============

  /**
   * Yangi album yaratish
   */
  async createAlbum(
    userId: string,
    dto: CreateMediaAlbumDto,
    coverImage?: Express.Multer.File,
  ) {
    // Validatsiya: sarlavhalar majburiy
    if (
      !dto.title_latin?.trim() ||
      !dto.title_cyril?.trim() ||
      !dto.title_ru?.trim()
    ) {
      throw new BadRequestException('Barcha tillardagi sarlavha majburiy');
    }

    let coverImageUrl: string | null = null;

    if (coverImage) {
      try {
        const saved = await this.storageService.saveFile(
          coverImage,
          'media_albums',
        );
        coverImageUrl = saved.url;
      } catch (error) {
        throw new BadRequestException(
          'Muqova rasmini saqlashda xato: ' + error.message,
        );
      }
    }

    try {
      return await this.prisma.mediaAlbum.create({
        data: {
          type: dto.type,
          title_latin: dto.title_latin.trim(),
          title_cyril: dto.title_cyril.trim(),
          title_ru: dto.title_ru.trim(),
          cover_image: coverImageUrl,
          is_public: dto.is_public ?? true,
          creator_id: userId,
        },
        include: {
          items: { orderBy: { order: 'asc' } },
          creator: { select: { id: true, full_name: true } },
        },
      });
    } catch (error) {
      if (coverImageUrl) {
        await this.storageService.deleteFile(coverImageUrl);
      }
      this.logger.error(`Album yaratishda xato: ${error.message}`);
      throw new BadRequestException('Album yaratishda xato yuz berdi');
    }
  }

  /**
   * Barcha albumlarni olish (filter + search + pagination)
   */
  async findAll(query: QueryMediaAlbumDto) {
    const { skip, take, page, limit } = buildPaginationParams(query);

    const conditions: any = {};

    if (query.is_public !== undefined) {
      conditions.is_public = query.is_public;
    }
    // Filter by type
    if (query.type) {
      conditions.type = query.type;
    }

    // Search by title
    if (query.search) {
      const title = buildMultilangSearchWhere(query.search, 'title');
      conditions.OR = [
        ...(title?.OR || []),
      ];
    }

    try {
      const [albums, total] = await Promise.all([
        this.prisma.mediaAlbum.findMany({
          where: conditions,
          skip,
          take,
          orderBy: { [query.sortBy || 'created_at']: query.sortOrder || 'desc' },
          include: {
            items: { orderBy: { order: 'asc' } },
            creator: { select: { id: true, full_name: true } },
          },
        }),
        this.prisma.mediaAlbum.count({ where: conditions }),
      ]);

      return buildPaginatedResponse(albums, total, page, limit);
    } catch (error) {
      this.logger.error(`Albumlarni o'qishda xato: ${error.message}`);
      throw new BadRequestException('Albumlarni yuklashda xato yuz berdi');
    }
  }

  /**
   * Bitta albumni olish
   */
  async findOne(albumId: string, is_public?: boolean) {
    if (!albumId?.trim()) {
      throw new BadRequestException('Album ID majburiy');
    }
    const where: any = { id: albumId };
    if (is_public === true) {
      where.is_public = true;
    }
    if (is_public === false) {
      where.is_public = false;
    }
    const album = await this.prisma.mediaAlbum.findUnique({
      where,
      include: {
        items: { orderBy: { order: 'asc' } },
        creator: { select: { id: true, full_name: true } },
      },
    });

    if (!album) {
      throw new NotFoundException('Album topilmadi');
    }

    return album;
  }

  /**
   * Albumni yangilash
   */
  async updateAlbum(
    albumId: string,
    dto: UpdateMediaAlbumDto,
    newCoverImage?: Express.Multer.File,
  ) {
    const album = await this.findOne(albumId);

    const data: any = {};

    if (dto.title_latin !== undefined) {
      if (!dto.title_latin.trim()) {
        throw new BadRequestException('Sarlavha lotin bo\'sh bo\'lishi mumkin emas');
      }
      data.title_latin = dto.title_latin.trim();
    }

    if (dto.title_cyril !== undefined) {
      if (!dto.title_cyril.trim()) {
        throw new BadRequestException('Sarlavha kirill bo\'sh bo\'lishi mumkin emas');
      }
      data.title_cyril = dto.title_cyril.trim();
    }

    if (dto.title_ru !== undefined) {
      if (!dto.title_ru.trim()) {
        throw new BadRequestException('Sarlavha rus bo\'sh bo\'lishi mumkin emas');
      }
      data.title_ru = dto.title_ru.trim();
    }

    if (dto.is_public !== undefined) {
      data.is_public = dto.is_public;
    }

    let newCoverImageUrl: string | null = null;

    if (newCoverImage) {
      try {
        const saved = await this.storageService.saveFile(
          newCoverImage,
          'media_albums',
        );
        newCoverImageUrl = saved.url;
        data.cover_image = newCoverImageUrl;
      } catch (error) {
        throw new BadRequestException(
          'Rasmni saqlashda xato: ' + error.message,
        );
      }
    }

    try {
      const updated = await this.prisma.mediaAlbum.update({
        where: { id: albumId },
        data,
        include: {
          items: { orderBy: { order: 'asc' } },
          creator: { select: { id: true, full_name: true } },
        },
      });

      // Eski rasmni o'chir (agar yangi kelgan bo'lsa)
      if (newCoverImageUrl && album.cover_image) {
        await this.storageService.deleteFile(album.cover_image);
      }

      return updated;
    } catch (error) {
      if (newCoverImageUrl) {
        await this.storageService.deleteFile(newCoverImageUrl);
      }
      this.logger.error(`Album yangilashda xato: ${error.message}`);
      throw new BadRequestException('Album yangilashda xato yuz berdi');
    }
  }

  /**
   * Albumni o'chirish (cascadega items ham o'chilinadi)
   */
  async removeAlbum(albumId: string) {
    const album = await this.findOne(albumId);

    const itemUrls = album.items.map((item) => item.url);

    try {
      // DB'dan o'chir (cascade handles items)
      await this.prisma.mediaAlbum.delete({ where: { id: albumId } });

      // Storage'dan o'chir
      if (album.cover_image) {
        await this.storageService.deleteFile(album.cover_image);
      }

      if (itemUrls.length > 0) {
        await Promise.allSettled(
          itemUrls.map((url) => this.storageService.deleteFile(url)),
        );
      }

      return { success: true, message: 'Album muvaffaqiyatli o\'chirildi' };
    } catch (error) {
      this.logger.error(`Album o'chirishda xato: ${error.message}`);
      throw new BadRequestException('Album o\'chirishda xato yuz berdi');
    }
  }

  // ============= MEDIA ITEMS =============

  /**
   * Album'ga item qo'shish - TYPE ga qarab validatsiya
   */
  async addMediaItem(
    albumId: string,
    dto: CreateMediaItemDto,
    file?: Express.Multer.File,
  ) {
    // Album mavjudligini tekshir
    const album = await this.findOne(albumId);

    // Type ga qarab validatsiya
    switch (album.type) {
      case MediaType.PHOTO:
        return this.addPhotoItem(albumId, file);

      case MediaType.VIDEO:
        return this.addVideoItem(albumId, dto.video_url);

      case MediaType.PRESENTATION:
        return this.addPresentationItem(albumId, dto.video_url, file);

      default:
        throw new BadRequestException('Noto\'g\'ri album turi');
    }
  }

  /**
   * PHOTO type - Faqat fayl (rasm)
   */
  private async addPhotoItem(albumId: string, file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Rasm fayli majburiy');
    }

    // Rasm bo'lishi tekshir
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException(
        'Faqat rasm fayli qabul qilinadi (PNG, JPEG, WebP)',
      );
    }

    // Hajm tekshiruvi (5MB gacha)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      throw new BadRequestException('Rasm hajmi 5MB gacha bo\'lishi kerak');
    }

    let imageUrl: string;

    try {
      const saved = await this.storageService.saveFile(file, 'media_items');
      imageUrl = saved.url;
    } catch (error) {
      throw new BadRequestException(
        'Rasmni saqlashda xato: ' + error.message,
      );
    }

    try {
      const order = await this.getNextOrderNumber(albumId);

      return await this.prisma.mediaItem.create({
        data: {
          album_id: albumId,
          url: imageUrl,
          file_name: file.originalname,
          file_size: file.size,
          order,
        },
      });
    } catch (error) {
      await this.storageService.deleteFile(imageUrl);
      this.logger.error(`Rasm qo'shishda xato: ${error.message}`);
      throw new BadRequestException('Rasm qo\'shishda xato yuz berdi');
    }
  }

  /**
   * VIDEO type - Faqat URL (YouTube, Vimeo)
   */
  private async addVideoItem(albumId: string, videoUrl?: string) {
    if (!videoUrl?.trim()) {
      throw new BadRequestException('Video URL majburiy');
    }

    const trimmedUrl = videoUrl.trim();

    // URL validatsiya
    // if (
    //   !trimmedUrl.includes('youtube.com') &&
    //   !trimmedUrl.includes('youtu.be') &&
    //   !trimmedUrl.includes('vimeo.com')
    // ) {
    //   throw new BadRequestException(
    //     'Faqat YouTube yoki Vimeo URL ruxsat etiladi',
    //   );
    // }

    try {
      const order = await this.getNextOrderNumber(albumId);

      return await this.prisma.mediaItem.create({
        data: {
          album_id: albumId,
          url: trimmedUrl,
          file_name: this.extractUrlTitle(trimmedUrl),
          order,
        },
      });
    } catch (error) {
      this.logger.error(`Video URL qo'shishda xato: ${error.message}`);
      throw new BadRequestException('Video URL qo\'shishda xato yuz berdi');
    }
  }

  /**
   * PRESENTATION type - URL yoki Fayl
   */
  private async addPresentationItem(
    albumId: string,
    videoUrl?: string,
    file?: Express.Multer.File,
  ) {
    // Kamita bittasi majburiy
    if (!videoUrl?.trim() && !file) {
      throw new BadRequestException(
        'YouTube URL yoki taqdimot fayli (PDF/PPTX) majburiy bo\'lishi kerak',
      );
    }

    // URL ni prioritet qil
    if (videoUrl?.trim()) {
      // YouTube URL validatsiya
      // if (
      //   !videoUrl.includes('youtube.com') &&
      //   !videoUrl.includes('youtu.be') &&
      //   !videoUrl.includes('vimeo.com')
      // ) {
      //   throw new BadRequestException(
      //     'Faqat YouTube yoki Vimeo URL ruxsat etiladi',
      //   );
      // }

      try {
        const order = await this.getNextOrderNumber(albumId);

        return await this.prisma.mediaItem.create({
          data: {
            album_id: albumId,
            url: videoUrl.trim(),
            file_name: this.extractUrlTitle(videoUrl.trim()),
            order,
          },
        });
      } catch (error) {
        this.logger.error(`Presentation URL qo'shishda xato: ${error.message}`);
        throw new BadRequestException(
          'Presentation URL qo\'shishda xato yuz berdi',
        );
      }
    }

    // Fayl yuklash
    if (file) {
      return this.addPresentationFile(albumId, file);
    }
  }

  /**
   * PRESENTATION fayl yuklash (PDF, PPTX)
   */
  private async addPresentationFile(
    albumId: string,
    file: Express.Multer.File,
  ) {
    // Fayl turi tekshir
    const allowedMimes = [
      'application/pdf',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ];

    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Faqat PDF yoki PowerPoint (PPTX) fayl ruxsat etiladi',
      );
    }

    // Hajm tekshiruvi (50MB gacha)
    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      throw new BadRequestException(
        'Taqdimot fayli 50MB gacha bo\'lishi kerak',
      );
    }

    let fileUrl: string;

    try {
      const saved = await this.storageService.saveFile(
        file,
        'media_presentations',
      );
      fileUrl = saved.url;
    } catch (error) {
      throw new BadRequestException(
        'Taqdimot faylini saqlashda xato: ' + error.message,
      );
    }

    try {
      const order = await this.getNextOrderNumber(albumId);

      return await this.prisma.mediaItem.create({
        data: {
          album_id: albumId,
          url: fileUrl,
          file_name: file.originalname,
          file_size: file.size,
          order,
        },
      });
    } catch (error) {
      await this.storageService.deleteFile(fileUrl);
      this.logger.error(`Presentation fayli qo'shishda xato: ${error.message}`);
      throw new BadRequestException('Presentation fayli qo\'shishda xato yuz berdi');
    }
  }

  /**
   * Album'dagi barcha item larni olish
   */
  async getAlbumItems(albumId: string) {
    const album = await this.findOne(albumId);

    return this.prisma.mediaItem.findMany({
      where: { album_id: albumId },
      orderBy: { order: 'asc' },
    });
  }

  /**
   * Item tartib raqamini o'zgartirish
   */
  async updateItemOrder(albumId: string, itemId: string, order: number) {
    if (order < 0) {
      throw new BadRequestException('Tartib raqami 0 dan katta bo\'lishi kerak');
    }

    const item = await this.prisma.mediaItem.findFirst({
      where: { id: itemId, album_id: albumId },
    });

    if (!item) {
      throw new NotFoundException('Item bu albomda topilmadi');
    }

    try {
      return await this.prisma.mediaItem.update({
        where: { id: itemId },
        data: { order },
      });
    } catch (error) {
      this.logger.error(`Item tartibini o'zgartirishda xato: ${error.message}`);
      throw new BadRequestException(
        'Item tartibini o\'zgartirishda xato yuz berdi',
      );
    }
  }

  /**
   * Item'ni o'chirish
   */
  async removeMediaItem(albumId: string, itemId: string) {
    const item = await this.prisma.mediaItem.findFirst({
      where: { id: itemId, album_id: albumId },
    });

    if (!item) {
      throw new NotFoundException('Item bu albomda topilmadi');
    }

    try {
      await this.prisma.mediaItem.delete({ where: { id: itemId } });
      await this.storageService.deleteFile(item.url);

      return { success: true, message: 'Item muvaffaqiyatli o\'chirildi' };
    } catch (error) {
      this.logger.error(`Item o'chirishda xato: ${error.message}`);
      throw new BadRequestException('Item o\'chirishda xato yuz berdi');
    }
  }

  // ============= HELPERS =============

  /**
   * Keyingi order raqamini olish
   */
  private async getNextOrderNumber(albumId: string): Promise<number> {
    const lastItem = await this.prisma.mediaItem.findFirst({
      where: { album_id: albumId },
      orderBy: { order: 'desc' },
    });

    return (lastItem?.order ?? -1) + 1;
  }

  /**
   * YouTube URL'dan video nomini ekstraktish
   */
  private extractUrlTitle(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname || 'Media';
    } catch (e) {
      return 'Media';
    }
  }
}