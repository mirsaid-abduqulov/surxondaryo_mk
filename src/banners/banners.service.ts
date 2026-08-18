// banners.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { PrismaService } from 'src/core/database/prisma.service';
import { StorageService } from 'src/common/storage/storage.service';
import { buildPaginationParams, buildPaginatedResponse } from 'src/common/helpers/pagination.helper';
import { QueryBannerDto } from './dto/get-all-querry.dto';
import { IsActiveDto } from './dto/is_active.dto';
import { query } from 'axios';

@Injectable()
export class BannersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) { }

  async create(createBannerDto: CreateBannerDto, imageFile?: Express.Multer.File) {
    if (!imageFile) {
      throw new BadRequestException('Banner rasmi majburiy');
    }

    let imageUrl: string;
    try {
      const saved = await this.storageService.saveFile(imageFile, 'banners');
      imageUrl = saved.url;
    } catch (error) {
      throw new BadRequestException('Rasmni saqlashda xato: ' + error.message);
    }

    try {
      const banner = await this.prisma.banner.create({
        data: {
          title_latin: createBannerDto.title_latin || null,
          title_cyril: createBannerDto.title_cyril || null,
          title_ru: createBannerDto.title_ru || null,
          image_url: imageUrl,
          link_url: createBannerDto.link_url || null,
          order: createBannerDto.order ?? 0,
          is_active: createBannerDto.is_active ?? true,
        },
      });
      return banner;
    } catch (error) {
      await this.storageService.deleteFile(imageUrl);
      throw error;
    }
  }

  async findAll(query: QueryBannerDto, is_active?: boolean) {
    const { skip, take, page, limit } = buildPaginationParams(query);

    const where: any = {};
    if (is_active === true) {
      where.is_active = true;
    }
    if (is_active === false) {
      where.is_active = false;
    }

    if (query.search) {
      where.OR = [
        { title_latin: { contains: query.search } },
        { title_cyril: { contains: query.search } },
        { title_ru: { contains: query.search } },
      ];
    }

    const [banners, total] = await Promise.all([
      this.prisma.banner.findMany({
        where,
        skip,
        take,
        orderBy: { order: 'asc' },
      }),
      this.prisma.banner.count({ where }),
    ]);

    return buildPaginatedResponse(banners, total, page, limit);
  }

  async findOne(id: string, is_active?: boolean) {

    const where: any = { id };
    if (is_active === true) {
      where.is_active = true;
    }
    if (is_active === false) {
      where.is_active = false;
    }

    const banner = await this.prisma.banner.findUnique({
      where,
    });
    if (!banner) throw new NotFoundException('Banner topilmadi');
    return banner;
  }

  async update(id: string, updateBannerDto: UpdateBannerDto, imageFile?: Express.Multer.File) {
    const banner = await this.prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) throw new NotFoundException('Banner topilmadi');

    let newImageUrl: string | null = null;
    if (imageFile) {
      try {
        const saved = await this.storageService.saveFile(imageFile, 'banners');
        newImageUrl = saved.url;
      } catch (error) {
        throw new BadRequestException('Rasmni saqlashda xato: ' + error.message);
      }
    }

    const data: any = {};

    if (updateBannerDto.title_latin !== undefined) {
      data.title_latin = updateBannerDto.title_latin || null;
    }
    if (updateBannerDto.title_cyril !== undefined) {
      data.title_cyril = updateBannerDto.title_cyril || null;
    }
    if (updateBannerDto.title_ru !== undefined) {
      data.title_ru = updateBannerDto.title_ru || null;
    }
    if (updateBannerDto.link_url !== undefined) {
      data.link_url = updateBannerDto.link_url || null;
    }
    if (updateBannerDto.order !== undefined) {
      data.order = updateBannerDto.order;
    }
    if (updateBannerDto.is_active !== undefined) {
      data.is_active = updateBannerDto.is_active;
    }
    if (newImageUrl) {
      data.image_url = newImageUrl;
    }

    try {
      const updated = await this.prisma.banner.update({
        where: { id },
        data,
      });

      if (newImageUrl && banner.image_url) {
        await this.storageService.deleteFile(banner.image_url);
      }

      return updated;
    } catch (error) {
      if (newImageUrl) {
        await this.storageService.deleteFile(newImageUrl);
      }
      throw error;
    }
  }

  async remove(id: string) {
    const banner = await this.prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) throw new NotFoundException('Banner topilmadi');

    await this.prisma.banner.delete({ where: { id } });

    if (banner.image_url) {
      await this.storageService.deleteFile(banner.image_url);
    }

    return { success: true };
  }

  async updateIsActive(id: string, dto: IsActiveDto) {
    const banner = await this.prisma.banner.findUnique({
      where: { id },
    });
    if (!banner) throw new NotFoundException('Banner topilmadi');

    const updated = await this.prisma.banner.update({
      where: { id },
      data: {
        is_active: dto.is_active,
      },
    });

    return updated;
  }
}