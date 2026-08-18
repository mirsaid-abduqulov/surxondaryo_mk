import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../core/database/prisma.service';
import { CreateDirectorAppealDto } from './dto/create-director-appeal.dto';
import { UpdateDirectorAppealDto } from './dto/update-director-appeal.dto';
import { QueryDirectorAppealDto } from './dto/query-director-appeal.dto';
import { buildPaginationParams, buildPaginatedResponse } from '../common/helpers/pagination.helper';
import { AppealStatus } from '../core/database/generated';

@Injectable()
export class AppealsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateDirectorAppealDto) {
    return this.prisma.directorAppeal.create({
      data: {
        full_name: dto.full_name,
        phone: dto.phone,
        email: dto.email,
        subject: dto.subject,
        message: dto.message,
      },
    });
  }

  async findAll(query: QueryDirectorAppealDto) {
    const { skip, take, page, limit } = buildPaginationParams(query);

    const where: any = {};
    if (query.status) where.status = query.status;

    if (query.search) {
      where.OR = [
        { full_name: { contains: query.search, mode: 'insensitive' } },
        { phone: { contains: query.search, mode: 'insensitive' } },
        { subject: { contains: query.search, mode: 'insensitive' } },
        { message: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.directorAppeal.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.directorAppeal.count({ where }),
    ]);

    return buildPaginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    const item = await this.prisma.directorAppeal.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Murojaat topilmadi');
    return item;
  }

  async update(id: string, dto: UpdateDirectorAppealDto) {
    await this.findOne(id);

    const data: any = { ...dto };

    // Javob berilsa — answered_at ni belgilash va statusni ANSWERED qilish
    if (dto.answer && dto.answer.trim()) {
      data.answered_at = new Date();
      if (!dto.status) data.status = AppealStatus.ANSWERED;
    }

    return this.prisma.directorAppeal.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.directorAppeal.delete({ where: { id } });
    return { success: true };
  }
}
