import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../core/database/prisma.service';
import { CreateRequiredDocumentDto } from './dto/create-required-document.dto';
import { UpdateRequiredDocumentDto } from './dto/update-required-document.dto';
import { buildPaginationParams, buildPaginatedResponse } from '../common/helpers/pagination.helper';
import { BaseQueryDto } from '../common/dto/base-query.dto';

@Injectable()
export class RequiredDocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRequiredDocumentDto) {
    return this.prisma.requiredDocument.create({ data: { ...dto } });
  }

  async findAll(query: BaseQueryDto) {
    const { skip, take, page, limit } = buildPaginationParams(query);

    const where: any = { is_active: true };
    if (query.search) {
      where.OR = [
        { title_latin: { contains: query.search, mode: 'insensitive' } },
        { title_cyril: { contains: query.search, mode: 'insensitive' } },
        { title_ru: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.requiredDocument.findMany({
        where,
        skip,
        take,
        orderBy: { order: 'asc' },
      }),
      this.prisma.requiredDocument.count({ where }),
    ]);

    return buildPaginatedResponse(data, total, page, limit);
  }

  async findAllAdmin(query: BaseQueryDto) {
    const { skip, take, page, limit } = buildPaginationParams(query);

    const where: any = {};
    if (query.search) {
      where.OR = [
        { title_latin: { contains: query.search, mode: 'insensitive' } },
        { title_cyril: { contains: query.search, mode: 'insensitive' } },
        { title_ru: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.requiredDocument.findMany({
        where,
        skip,
        take,
        orderBy: { order: 'asc' },
      }),
      this.prisma.requiredDocument.count({ where }),
    ]);

    return buildPaginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    const item = await this.prisma.requiredDocument.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Hujjat topilmadi');
    return item;
  }

  async update(id: string, dto: UpdateRequiredDocumentDto) {
    await this.findOne(id);
    return this.prisma.requiredDocument.update({ where: { id }, data: { ...dto } });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.requiredDocument.delete({ where: { id } });
    return { success: true };
  }
}
