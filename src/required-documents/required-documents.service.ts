import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../core/database/prisma.service';
import { CreateRequiredDocumentDto } from './dto/create-required-document.dto';
import { UpdateRequiredDocumentDto } from './dto/update-required-document.dto';
import { buildPaginationParams, buildPaginatedResponse } from '../common/helpers/pagination.helper';
import { BaseQueryDto } from '../common/dto/base-query.dto';
import { buildMultilangSearchWhere } from 'src/common/helpers/multilang-search.helper';

@Injectable()
export class RequiredDocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRequiredDocumentDto) {
    return this.prisma.requiredDocument.create({ data: { ...dto } });
  }

  async findAll(query: BaseQueryDto,is_active?:boolean) {
    const { skip, take, page, limit } = buildPaginationParams(query);
    const where: any = {};
     if (typeof is_active === 'boolean') {
    where.is_active = is_active;
  }


    if (query.search) {
      const titleFilter=buildMultilangSearchWhere(query.search,'title')
       where.OR=[...(titleFilter?.OR || [])]
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

  async findOne(id: string,is_active?:boolean) {
    const where: any = {id};
    if (is_active!=undefined){
      where.is_active = is_active;
    }
    const item = await this.prisma.requiredDocument.findUnique({ where });
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
