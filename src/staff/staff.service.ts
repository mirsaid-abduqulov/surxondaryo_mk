import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../core/database/prisma.service';
import { StorageService } from '../common/storage/storage.service';
import { CreateStaffMemberDto } from './dto/create-staff-member.dto';
import { UpdateStaffMemberDto } from './dto/update-staff-member.dto';
import { QueryStaffMemberDto } from './dto/query-staff-member.dto';
import { buildPaginationParams, buildPaginatedResponse } from '../common/helpers/pagination.helper';
import { normalizeName } from '../common/helpers/normalize-name.helper';

@Injectable()
export class StaffService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async create(
    creatorId: string,
    createDto: CreateStaffMemberDto,
    photo?: Express.Multer.File,
  ) {
    let photoUrl: string | null = null;
    if (photo) {
      const saved = await this.storageService.saveFile(photo, 'staff_photos');
      photoUrl = saved.url;
    }

    return this.prisma.staffMember.create({
      data: {
        full_name_latin: normalizeName(createDto.full_name_latin),
        full_name_cyril: normalizeName(createDto.full_name_cyril),
        full_name_ru: normalizeName(createDto.full_name_ru),
        category: createDto.category,
        position_latin: createDto.position_latin,
        position_cyril: createDto.position_cyril,
        position_ru: createDto.position_ru,
        subject_latin: createDto.subject_latin,
        subject_cyril: createDto.subject_cyril,
        subject_ru: createDto.subject_ru,
        bio_latin: createDto.bio_latin,
        bio_cyril: createDto.bio_cyril,
        bio_ru: createDto.bio_ru,
        phone: createDto.phone,
        email: createDto.email,
        reception_days: createDto.reception_days,
        degree_latin: createDto.degree_latin,
        degree_cyril: createDto.degree_cyril,
        degree_ru: createDto.degree_ru,
        order: createDto.order ?? 0,
        is_active: createDto.is_active ?? true,
        photo_url: photoUrl,
        creator_id: creatorId,
      },
      include: { creator: { select: { id: true, full_name: true } } },
    });
  }

  async findAll(query: QueryStaffMemberDto) {
    const { skip, take, page, limit } = buildPaginationParams(query);

    const where: any = {};

    if (query.category) {
      where.category = query.category;
    }
    if (query.is_active !== undefined) {
      where.is_active = query.is_active === 'true';
    }

    if (query.search) {
      where.OR = [
        { full_name_latin: { contains: query.search, mode: 'insensitive' } },
        { full_name_cyril: { contains: query.search, mode: 'insensitive' } },
        { full_name_ru: { contains: query.search, mode: 'insensitive' } },
        { position_latin: { contains: query.search, mode: 'insensitive' } },
        { position_cyril: { contains: query.search, mode: 'insensitive' } },
        { position_ru: { contains: query.search, mode: 'insensitive' } },
        { subject_latin: { contains: query.search, mode: 'insensitive' } },
        { subject_cyril: { contains: query.search, mode: 'insensitive' } },
        { phone: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.staffMember.findMany({
        where,
        skip,
        take,
        orderBy: { order: 'asc' },
        include: { creator: { select: { id: true, full_name: true } } },
      }),
      this.prisma.staffMember.count({ where }),
    ]);

    return buildPaginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    const member = await this.prisma.staffMember.findUnique({
      where: { id },
      include: { creator: { select: { id: true, full_name: true } } },
    });
    if (!member) throw new NotFoundException('Xodim topilmadi');
    return member;
  }

  async update(
    id: string,
    updateDto: UpdateStaffMemberDto,
    photo?: Express.Multer.File,
  ) {
    const existing = await this.findOne(id);

    let photoUpdateData: any = {};
    if (photo) {
      const fileInfo = existing.photo_url
        ? await this.storageService.replaceFile(existing.photo_url, photo, 'staff_photos')
        : await this.storageService.saveFile(photo, 'staff_photos');
      photoUpdateData = { photo_url: fileInfo.url };
    }

    const data: any = { ...photoUpdateData };

    if (updateDto.full_name_latin !== undefined) data.full_name_latin = normalizeName(updateDto.full_name_latin);
    if (updateDto.full_name_cyril !== undefined) data.full_name_cyril = normalizeName(updateDto.full_name_cyril);
    if (updateDto.full_name_ru !== undefined) data.full_name_ru = normalizeName(updateDto.full_name_ru);
    if (updateDto.category !== undefined) data.category = updateDto.category;
    if (updateDto.position_latin !== undefined) data.position_latin = updateDto.position_latin;
    if (updateDto.position_cyril !== undefined) data.position_cyril = updateDto.position_cyril;
    if (updateDto.position_ru !== undefined) data.position_ru = updateDto.position_ru;
    if (updateDto.subject_latin !== undefined) data.subject_latin = updateDto.subject_latin;
    if (updateDto.subject_cyril !== undefined) data.subject_cyril = updateDto.subject_cyril;
    if (updateDto.subject_ru !== undefined) data.subject_ru = updateDto.subject_ru;
    if (updateDto.bio_latin !== undefined) data.bio_latin = updateDto.bio_latin;
    if (updateDto.bio_cyril !== undefined) data.bio_cyril = updateDto.bio_cyril;
    if (updateDto.bio_ru !== undefined) data.bio_ru = updateDto.bio_ru;
    if (updateDto.phone !== undefined) data.phone = updateDto.phone;
    if (updateDto.email !== undefined) data.email = updateDto.email;
    if (updateDto.reception_days !== undefined) data.reception_days = updateDto.reception_days;
    if (updateDto.degree_latin !== undefined) data.degree_latin = updateDto.degree_latin;
    if (updateDto.degree_cyril !== undefined) data.degree_cyril = updateDto.degree_cyril;
    if (updateDto.degree_ru !== undefined) data.degree_ru = updateDto.degree_ru;
    if (updateDto.order !== undefined) data.order = updateDto.order;
    if (updateDto.is_active !== undefined) data.is_active = updateDto.is_active;

    return this.prisma.staffMember.update({
      where: { id },
      data,
      include: { creator: { select: { id: true, full_name: true } } },
    });
  }

  async remove(id: string) {
    const existing = await this.findOne(id);

    if (existing.photo_url) {
      await this.storageService.deleteFile(existing.photo_url);
    }

    await this.prisma.staffMember.delete({ where: { id } });
    return { success: true };
  }
}
