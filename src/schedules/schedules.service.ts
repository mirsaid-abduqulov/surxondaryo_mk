import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../core/database/prisma.service';
import { CreateClassScheduleDto } from './dto/create-class-schedule.dto';
import { UpdateClassScheduleDto } from './dto/update-class-schedule.dto';
import { QueryClassScheduleDto } from './dto/query-class-schedule.dto';
import { CreateBellScheduleDto } from './dto/create-bell-schedule.dto';
import { UpdateBellScheduleDto } from './dto/update-bell-schedule.dto';
import { CreateHolidayScheduleDto } from './dto/create-holiday-schedule.dto';
import { UpdateHolidayScheduleDto } from './dto/update-holiday-schedule.dto';
import { buildPaginationParams, buildPaginatedResponse } from '../common/helpers/pagination.helper';
import { BaseQueryDto } from '../common/dto/base-query.dto';

@Injectable()
export class SchedulesService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── ClassSchedule ───────────────────────────────────────────────────────────

  async createClassSchedule(dto: CreateClassScheduleDto) {
    return this.prisma.classSchedule.create({
      data: {
        grade: dto.grade.trim(),
        day: dto.day,
        lesson_number: dto.lesson_number,
        subject_latin: dto.subject_latin,
        subject_cyril: dto.subject_cyril,
        subject_ru: dto.subject_ru,
        teacher_name: dto.teacher_name,
        room: dto.room,
        start_time: dto.start_time,
        end_time: dto.end_time,
      },
    });
  }

  async findAllClassSchedules(query: QueryClassScheduleDto) {
    const { skip, take, page, limit } = buildPaginationParams(query);

    const where: any = {};
    if (query.grade) where.grade = { equals: query.grade, mode: 'insensitive' };
    if (query.day) where.day = query.day;
    if (query.search) {
      where.OR = [
        { subject_latin: { contains: query.search, mode: 'insensitive' } },
        { subject_cyril: { contains: query.search, mode: 'insensitive' } },
        { teacher_name: { contains: query.search, mode: 'insensitive' } },
        { grade: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.classSchedule.findMany({
        where,
        skip,
        take,
        orderBy: [{ grade: 'asc' }, { day: 'asc' }, { lesson_number: 'asc' }],
      }),
      this.prisma.classSchedule.count({ where }),
    ]);

    return buildPaginatedResponse(data, total, page, limit);
  }

  async findOneClassSchedule(id: string) {
    const item = await this.prisma.classSchedule.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Dars jadvali topilmadi');
    return item;
  }

  async updateClassSchedule(id: string, dto: UpdateClassScheduleDto) {
    await this.findOneClassSchedule(id);
    return this.prisma.classSchedule.update({ where: { id }, data: { ...dto } });
  }

  async removeClassSchedule(id: string) {
    await this.findOneClassSchedule(id);
    await this.prisma.classSchedule.delete({ where: { id } });
    return { success: true };
  }

  // ─── BellSchedule ────────────────────────────────────────────────────────────

  async createBellSchedule(dto: CreateBellScheduleDto) {
    const shift = dto.shift ?? 1;
    const existing = await this.prisma.bellSchedule.findUnique({
      where: { lesson_number_shift: { lesson_number: dto.lesson_number, shift } },
    });
    if (existing) {
      throw new ConflictException(
        `${shift}-smena uchun ${dto.lesson_number}-dars allaqachon mavjud`,
      );
    }

    return this.prisma.bellSchedule.create({
      data: {
        lesson_number: dto.lesson_number,
        start_time: dto.start_time,
        end_time: dto.end_time,
        break_minutes: dto.break_minutes,
        shift,
        is_active: dto.is_active ?? true,
      },
    });
  }

  async findAllBellSchedules(shift?: number) {
    const where: any = {};
    if (shift) where.shift = shift;

    return this.prisma.bellSchedule.findMany({
      where,
      orderBy: [{ shift: 'asc' }, { lesson_number: 'asc' }],
    });
  }

  async findOneBellSchedule(id: string) {
    const item = await this.prisma.bellSchedule.findUnique({ where: { id } });
    if (!item) throw new NotFoundException("Qo'ng'iroq jadvali topilmadi");
    return item;
  }

  async updateBellSchedule(id: string, dto: UpdateBellScheduleDto) {
    await this.findOneBellSchedule(id);
    return this.prisma.bellSchedule.update({ where: { id }, data: { ...dto } });
  }

  async removeBellSchedule(id: string) {
    await this.findOneBellSchedule(id);
    await this.prisma.bellSchedule.delete({ where: { id } });
    return { success: true };
  }

  // ─── HolidaySchedule ─────────────────────────────────────────────────────────

  async createHolidaySchedule(dto: CreateHolidayScheduleDto) {
    return this.prisma.holidaySchedule.create({
      data: {
        title_latin: dto.title_latin,
        title_cyril: dto.title_cyril,
        title_ru: dto.title_ru,
        start_date: new Date(dto.start_date),
        end_date: new Date(dto.end_date),
        description_latin: dto.description_latin,
        description_cyril: dto.description_cyril,
        description_ru: dto.description_ru,
      },
    });
  }

  async findAllHolidaySchedules(query: BaseQueryDto) {
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
      this.prisma.holidaySchedule.findMany({
        where,
        skip,
        take,
        orderBy: { start_date: 'asc' },
      }),
      this.prisma.holidaySchedule.count({ where }),
    ]);

    return buildPaginatedResponse(data, total, page, limit);
  }

  async findOneHolidaySchedule(id: string) {
    const item = await this.prisma.holidaySchedule.findUnique({ where: { id } });
    if (!item) throw new NotFoundException("Bayram/ta'til jadvali topilmadi");
    return item;
  }

  async updateHolidaySchedule(id: string, dto: UpdateHolidayScheduleDto) {
    await this.findOneHolidaySchedule(id);
    const data: any = { ...dto };
    if (dto.start_date) data.start_date = new Date(dto.start_date);
    if (dto.end_date) data.end_date = new Date(dto.end_date);
    return this.prisma.holidaySchedule.update({ where: { id }, data });
  }

  async removeHolidaySchedule(id: string) {
    await this.findOneHolidaySchedule(id);
    await this.prisma.holidaySchedule.delete({ where: { id } });
    return { success: true };
  }
}
