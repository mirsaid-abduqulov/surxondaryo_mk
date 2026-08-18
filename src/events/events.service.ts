import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../core/database/prisma.service';
import { StorageService } from '../common/storage/storage.service';
import { CreateEventsDto } from './dto/create-events.dto';
import { UpdateEventsDto } from './dto/update-events.dto';
import { QueryEventsDto } from './dto/query-events.dto';
import { buildMultilangSearchWhere } from '../common/helpers/multilang-search.helper';
import { buildPaginationParams, buildPaginatedResponse } from '../common/helpers/pagination.helper';
import { normalizeName } from '../common/helpers/normalize-name.helper';

@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async create(creatorId: string, createDto: CreateEventsDto, file?: Express.Multer.File) {
    const existUser = await this.prisma.user.findUnique({ where: { id: creatorId } });
    if (!existUser) throw new NotFoundException('Yaratuvchi topilmadi');
    let fileInfo: any = null;
    if (file) {
      fileInfo = await this.storageService.saveFile(file, 'events');
    }

    const title_latin = createDto.title_latin ? normalizeName(createDto.title_latin) : undefined;
    const title_cyril = createDto.title_cyril ? normalizeName(createDto.title_cyril) : undefined;
    const title_ru = createDto.title_ru ? normalizeName(createDto.title_ru) : undefined;

    
    const data = {
      ...createDto,
      title_latin, title_cyril, title_ru,
      creator_id: creatorId,
      ...(fileInfo && { cover_image: fileInfo.url }),
      event_date: new Date(createDto.event_date),
    };
    return this.prisma.event.create({ data });
    
  }

  async findAll(query: QueryEventsDto) {
    const { page, limit, skip } = buildPaginationParams(query);
    
    const where: any = {};
    
    
    where.is_public =query.is_public ?? true;
    if (query.upcoming !== undefined) {
      if (query.upcoming) {
        where.event_date = { gte: new Date() };
      }
    }
    if (query.type) {
      where.type = query.type;
    }
    
    
    if (query.search) {
      const searchWhere = buildMultilangSearchWhere(query.search, 'title');
      Object.assign(where, searchWhere);
    }
    
    const [items, total] = await this.prisma.$transaction([
      this.prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: query.sortBy ? { [query.sortBy]: query.sortOrder } : { event_date: query.upcoming ? 'asc' : 'desc' },
        include: { creator: { select: { id: true, full_name: true } } },
      }),
      this.prisma.event.count({ where })
    ]);
    
    return buildPaginatedResponse(items, total, page, limit);
  }

  async findOne(id: string, isAdmin = false) {
    const item = await this.prisma.event.findUnique({
      where: { id },
      include: { creator: { select: { id: true, full_name: true } } },
    });
    if (!item) throw new NotFoundException('Tadbir topilmadi');

    

    
    if (!item.is_public && !isAdmin) {
      throw new NotFoundException('Tadbir topilmadi');
    }
    

    return item;
  }

  async update(id: string, updateDto: UpdateEventsDto, file?: Express.Multer.File) {
    const existing = await this.findOne(id, true);
    
    let fileUpdateData: any = {};
    if (file) {
      
      const fileInfo = existing.cover_image 
        ? await this.storageService.replaceFile(existing.cover_image, file, 'events')
        : await this.storageService.saveFile(file, 'events');
      fileUpdateData = { cover_image: fileInfo.url };
      
    }

    const title_latin = updateDto.title_latin ? normalizeName(updateDto.title_latin) : undefined;
    const title_cyril = updateDto.title_cyril ? normalizeName(updateDto.title_cyril) : undefined;
    const title_ru = updateDto.title_ru ? normalizeName(updateDto.title_ru) : undefined;

    return this.prisma.event.update({
      where: { id },
      data: { ...updateDto, ...fileUpdateData, ...(title_latin && {title_latin}), ...(title_cyril && {title_cyril}), ...(title_ru && {title_ru}) },
    });
  }

  async remove(id: string) {
    const existing = await this.findOne(id, true);
    
    if (existing.cover_image) {
      await this.storageService.deleteFile(existing.cover_image);
    }
    
    return this.prisma.event.delete({ where: { id } });
  }

  
}
