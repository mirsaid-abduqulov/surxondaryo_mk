import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../core/database/prisma.service';
import { StorageService } from '../common/storage/storage.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { QueryClubDto } from './dto/query-club.dto';
import { buildPaginationParams, buildPaginatedResponse } from '../common/helpers/pagination.helper';
import { normalizeName } from '../common/helpers/normalize-name.helper';

@Injectable()
export class ClubsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async create(
    creatorId: string,
    createDto: CreateClubDto,
    coverImage?: Express.Multer.File,
  ) {
    let imageUrl: string | null = null;
    if (coverImage) {
      const saved = await this.storageService.saveFile(coverImage, 'clubs');
      imageUrl = saved.url;
    }

    return this.prisma.club.create({
      data: {
        name_latin: normalizeName(createDto.name_latin),
        name_cyril: normalizeName(createDto.name_cyril),
        name_ru: normalizeName(createDto.name_ru),
        category: createDto.category,
        description_latin: createDto.description_latin,
        description_cyril: createDto.description_cyril,
        description_ru: createDto.description_ru,
        supervisor_name: createDto.supervisor_name,
        age_group: createDto.age_group,
        schedule_latin: createDto.schedule_latin,
        schedule_cyril: createDto.schedule_cyril,
        schedule_ru: createDto.schedule_ru,
        location: createDto.location,
        is_active: createDto.is_active ?? true,
        cover_image: imageUrl,
        creator_id: creatorId,
      },
      include: { creator: { select: { id: true, full_name: true } } },
    });
  }

  async findAll(query: QueryClubDto) {
    const { skip, take, page, limit } = buildPaginationParams(query);

    const where: any = {};

    if (query.category) where.category = query.category;
    if (query.is_active !== undefined) where.is_active = query.is_active === 'true';

    if (query.search) {
      where.OR = [
        { name_latin: { contains: query.search, mode: 'insensitive' } },
        { name_cyril: { contains: query.search, mode: 'insensitive' } },
        { name_ru: { contains: query.search, mode: 'insensitive' } },
        { description_latin: { contains: query.search, mode: 'insensitive' } },
        { supervisor_name: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.club.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: 'desc' },
        include: { creator: { select: { id: true, full_name: true } } },
      }),
      this.prisma.club.count({ where }),
    ]);

    return buildPaginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    const club = await this.prisma.club.findUnique({
      where: { id },
      include: { creator: { select: { id: true, full_name: true } } },
    });
    if (!club) throw new NotFoundException("To'garak topilmadi");
    return club;
  }

  async update(
    id: string,
    updateDto: UpdateClubDto,
    coverImage?: Express.Multer.File,
  ) {
    const existing = await this.findOne(id);

    let imageUpdateData: any = {};
    if (coverImage) {
      const fileInfo = existing.cover_image
        ? await this.storageService.replaceFile(existing.cover_image, coverImage, 'clubs')
        : await this.storageService.saveFile(coverImage, 'clubs');
      imageUpdateData = { cover_image: fileInfo.url };
    }

    const data: any = { ...imageUpdateData };

    if (updateDto.name_latin !== undefined) data.name_latin = normalizeName(updateDto.name_latin);
    if (updateDto.name_cyril !== undefined) data.name_cyril = normalizeName(updateDto.name_cyril);
    if (updateDto.name_ru !== undefined) data.name_ru = normalizeName(updateDto.name_ru);
    if (updateDto.category !== undefined) data.category = updateDto.category;
    if (updateDto.description_latin !== undefined) data.description_latin = updateDto.description_latin;
    if (updateDto.description_cyril !== undefined) data.description_cyril = updateDto.description_cyril;
    if (updateDto.description_ru !== undefined) data.description_ru = updateDto.description_ru;
    if (updateDto.supervisor_name !== undefined) data.supervisor_name = updateDto.supervisor_name;
    if (updateDto.age_group !== undefined) data.age_group = updateDto.age_group;
    if (updateDto.schedule_latin !== undefined) data.schedule_latin = updateDto.schedule_latin;
    if (updateDto.schedule_cyril !== undefined) data.schedule_cyril = updateDto.schedule_cyril;
    if (updateDto.schedule_ru !== undefined) data.schedule_ru = updateDto.schedule_ru;
    if (updateDto.location !== undefined) data.location = updateDto.location;
    if (updateDto.is_active !== undefined) data.is_active = updateDto.is_active;

    return this.prisma.club.update({
      where: { id },
      data,
      include: { creator: { select: { id: true, full_name: true } } },
    });
  }

  async remove(id: string) {
    const existing = await this.findOne(id);

    if (existing.cover_image) {
      await this.storageService.deleteFile(existing.cover_image);
    }

    await this.prisma.club.delete({ where: { id } });
    return { success: true };
  }
}
