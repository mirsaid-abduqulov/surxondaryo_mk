import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../core/database/prisma.service';
import { StorageService } from '../common/storage/storage.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { QueryNewsDto } from './dto/query-news.dto';
import { buildMultilangSearchWhere } from '../common/helpers/multilang-search.helper';
import { buildPaginationParams, buildPaginatedResponse } from '../common/helpers/pagination.helper';
import { normalizeName } from '../common/helpers/normalize-name.helper';

@Injectable()
export class NewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) { }

  async create(creatorId: string, createDto: CreateNewsDto, file?: Express.Multer.File) {
    const existUser = await this.prisma.user.findUnique({ where: { id: creatorId } });
    if (!existUser) throw new NotFoundException('Yaratuvchi ID topilmadi');
    let fileInfo: any = null;
    if (file) {
      fileInfo = await this.storageService.saveFile(file, 'news');
    }

    const title_latin = createDto.title_latin ? normalizeName(createDto.title_latin) : undefined;
    const title_cyril = createDto.title_cyril ? normalizeName(createDto.title_cyril) : undefined;
    const title_ru = createDto.title_ru ? normalizeName(createDto.title_ru) : undefined;


    const data = {
      ...createDto,
      title_latin, title_cyril, title_ru,
      creator_id: creatorId,
      ...(fileInfo && { cover_image: fileInfo.url }),
    };
    return this.prisma.news.create({ data });

  }

  async findAll(query: QueryNewsDto, is_public?: boolean) {
    const { page, limit, skip } = buildPaginationParams(query);

    const where: any = {};

    if (is_public === true) {
      where.is_public = true;
    }
    if (is_public === false) {
      where.is_public = false;
    }

    if (query.search) {
      const title = normalizeName(query.search);
      const contentSearchWhere = buildMultilangSearchWhere(query.search, 'content');
      const searchWhere = buildMultilangSearchWhere(title, 'title');
      where.OR = [...(contentSearchWhere?.OR || []), ...(searchWhere?.OR || [])];
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.news.findMany({
        where,
        skip,
        take: limit,
        orderBy: query.sortBy ? { [query.sortBy]: query.sortOrder } : { 'published_at': 'desc' },
        include: { creator: { select: { id: true, full_name: true } } },
      }),
      this.prisma.news.count({ where })
    ]);

    return buildPaginatedResponse(items, total, page, limit);
  }

  async findOne(id: string, is_public?: boolean) {
    const where: any = { id };

    if (is_public === true) {
      where.is_public = true;
    }
    if (is_public === false) {
      where.is_public = false;
    }
    const item = await this.prisma.news.findUnique({
      where,
      include: { creator: { select: { id: true, full_name: true } } },
    });
    if (!item) throw new NotFoundException('Yangilik topilmadi');

    return item;
  }

  async update(id: string, updateDto: UpdateNewsDto, file?: Express.Multer.File) {
    const existing = await this.findOne(id);

    const data: any = {}
    let fileUpdateData: any = {};
    if (file) {

      const fileInfo = existing.cover_image
        ? await this.storageService.replaceFile(existing.cover_image, file, 'news')
        : await this.storageService.saveFile(file, 'news');
      fileUpdateData = { cover_image: fileInfo.url };

    }

    if (updateDto.title_latin && updateDto.title_latin?.trim()?.length > 0) data.title_latin = normalizeName(updateDto.title_latin);
    if (updateDto.title_cyril && updateDto.title_cyril?.trim()?.length > 0) data.title_cyril = normalizeName(updateDto.title_cyril);
    if (updateDto.title_ru && updateDto.title_ru?.trim()?.length > 0) data.title_ru = normalizeName(updateDto.title_ru);
    if (updateDto.content_latin && updateDto.content_latin?.trim()?.length > 0) data.content_latin = updateDto.content_latin;
    if (updateDto.content_cyril && updateDto.content_cyril?.trim()?.length > 0) data.content_cyril = updateDto.content_cyril;
    if (updateDto.content_ru && updateDto.content_ru?.trim()?.length > 0) data.content_ru = updateDto.content_ru;
    if(updateDto.is_public===true || updateDto.is_public===false){
      data.is_public = updateDto.is_public;
    }

    return this.prisma.news.update({
      where: { id },
      data: { ...data, ...fileUpdateData },
    });
  }

  async remove(id: string) {
    const existing = await this.findOne(id);

    if (existing.cover_image) {
      await this.storageService.deleteFile(existing.cover_image);
    }

    return this.prisma.news.delete({ where: { id } });
  }
}
