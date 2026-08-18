import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../core/database/prisma.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { buildPaginationParams, buildPaginatedResponse } from '../common/helpers/pagination.helper';
import { BaseQueryDto } from '../common/dto/base-query.dto';

@Injectable()
export class MeetingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMeetingDto) {
    return this.prisma.parentTeacherMeeting.create({
      data: {
        title_latin: dto.title_latin,
        title_cyril: dto.title_cyril,
        title_ru: dto.title_ru,
        description_latin: dto.description_latin,
        description_cyril: dto.description_cyril,
        description_ru: dto.description_ru,
        grade: dto.grade,
        meeting_date: new Date(dto.meeting_date),
        location: dto.location,
      },
    });
  }

  async findAll(query: BaseQueryDto) {
    const { skip, take, page, limit } = buildPaginationParams(query);

    const where: any = {};
    if (query.search) {
      where.OR = [
        { title_latin: { contains: query.search, mode: 'insensitive' } },
        { title_cyril: { contains: query.search, mode: 'insensitive' } },
        { title_ru: { contains: query.search, mode: 'insensitive' } },
        { grade: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.parentTeacherMeeting.findMany({
        where,
        skip,
        take,
        orderBy: { meeting_date: 'asc' },
      }),
      this.prisma.parentTeacherMeeting.count({ where }),
    ]);

    return buildPaginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    const item = await this.prisma.parentTeacherMeeting.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Uchrashuv topilmadi');
    return item;
  }

  async update(id: string, dto: UpdateMeetingDto) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.meeting_date) data.meeting_date = new Date(dto.meeting_date);
    return this.prisma.parentTeacherMeeting.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.parentTeacherMeeting.delete({ where: { id } });
    return { success: true };
  }
}
