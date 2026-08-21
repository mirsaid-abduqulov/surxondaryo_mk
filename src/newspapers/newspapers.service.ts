import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../core/database/prisma.service';
import { StorageService } from '../common/storage/storage.service';
import { CreateNewspaperDto } from './dto/create-newspaper.dto';
import { UpdateNewspaperDto } from './dto/update-newspaper.dto';
import { buildPaginationParams, buildPaginatedResponse } from '../common/helpers/pagination.helper';
import { BaseQueryDto } from '../common/dto/base-query.dto';
import { normalizeName } from '../common/helpers/normalize-name.helper';

@Injectable()
export class NewspapersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) { }

  async create(
    creatorId: string,
    dto: CreateNewspaperDto,
    file?: Express.Multer.File,
    coverImage?: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Gazeta PDF fayli majburiy');
    const existUser = await this.prisma.user.findUnique({ where: { id: creatorId } });
    if (!existUser) throw new NotFoundException('Yaratuvchi topilmadi');

    const fileInfo = await this.storageService.saveFile(file, 'newspapers');

    let coverUrl: string | null = null;
    if (coverImage) {
      const coverInfo = await this.storageService.saveFile(coverImage, 'newspapers');
      coverUrl = coverInfo.url;
    }

    return this.prisma.newspaper.create({
      data: {
        title_latin: normalizeName(dto.title_latin),
        title_cyril: normalizeName(dto.title_cyril),
        title_ru: normalizeName(dto.title_ru),
        issue_number: dto.issue_number,
        cover_image: coverUrl,
        file_url: fileInfo.url,
        file_size: fileInfo.fileSize,
        creator_id: creatorId,
      },
      include: { creator: { select: { id: true, full_name: true } } },
    });
  }

  async findAll(query: BaseQueryDto, is_public?: boolean) {
    const { skip, take, page, limit } = buildPaginationParams(query);

    const where: any = {};
    if (is_public !== undefined) {
      where.is_public = is_public;
    }
    if (query.search) {
      where.OR = [
        { title_latin: { contains: query.search, mode: 'insensitive' } },
        { title_cyril: { contains: query.search, mode: 'insensitive' } },
        { title_ru: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.newspaper.findMany({
        where,
        skip,
        take,
        orderBy: { published_at: 'desc' },
        include: { creator: { select: { id: true, full_name: true } } },
      }),
      this.prisma.newspaper.count({ where }),
    ]);

    return buildPaginatedResponse(data, total, page, limit);
  }

  async findOne(id: string, is_public?: boolean) {
    const where: any = { id };
    if (is_public !== undefined) {
      where.is_public = is_public;
    }
    const item = await this.prisma.newspaper.findUnique({
      where,
      include: { creator: { select: { id: true, full_name: true } } },
    });
    if (!item) throw new NotFoundException('Gazeta topilmadi');
    return item;
  }

  async update(
    id: string,
    dto: UpdateNewspaperDto,
    file?: Express.Multer.File,
    coverImage?: Express.Multer.File,
  ) {
    const existing = await this.findOne(id);

    let fileUpdateData: any = {};
    if (file) {
      const fileInfo = await this.storageService.replaceFile(existing.file_url, file, 'newspapers');
      fileUpdateData = { file_url: fileInfo.url, file_size: fileInfo.fileSize };
    }

    let coverUpdateData: any = {};
    if (coverImage) {
      const coverInfo = existing.cover_image
        ? await this.storageService.replaceFile(existing.cover_image, coverImage, 'newspapers')
        : await this.storageService.saveFile(coverImage, 'newspapers');
      coverUpdateData = { cover_image: coverInfo.url };
    }

    const data: any = { ...fileUpdateData, ...coverUpdateData };
    if (dto.title_latin !== undefined) data.title_latin = normalizeName(dto.title_latin);
    if (dto.title_cyril !== undefined) data.title_cyril = normalizeName(dto.title_cyril);
    if (dto.title_ru !== undefined) data.title_ru = normalizeName(dto.title_ru);
    if (dto.issue_number !== undefined) data.issue_number = dto.issue_number;
    if (dto.is_public !== undefined) data.is_public = dto.is_public;

    return this.prisma.newspaper.update({
      where: { id },
      data,
      include: { creator: { select: { id: true, full_name: true } } },
    });
  }

  async remove(id: string) {
    const existing = await this.findOne(id);

    await this.storageService.deleteFile(existing.file_url);
    if (existing.cover_image) {
      await this.storageService.deleteFile(existing.cover_image);
    }

    await this.prisma.newspaper.delete({ where: { id } });
    return { success: true };
  }
}
