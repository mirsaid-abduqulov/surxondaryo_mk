import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../core/database/prisma.service';
import { CreateClassScheduleDto } from './dto/create-class-schedule.dto';
import { UpdateClassScheduleDto } from './dto/update-class-schedule.dto';
import { ClassScheduleQueryDto } from './dto/class-schedule-query.dto';
import { DayScheduleDto } from './dto/day-schedule.dto';
import { LessonSlotDto } from './dto/lesson-slot.dto';
import { buildPaginatedResponse, buildPaginationParams } from '../common/helpers/pagination.helper';

@Injectable()
export class ClassScheduleService {
  private readonly logger = new Logger(ClassScheduleService.name);

  constructor(private readonly prisma: PrismaService) { }

  /**
   * Jadval validatsiyasi:
   * 1. Har bir kun uchun lesson_number takrorlanmasligi.
   * 2. teacher_id yuborilgan bo'lsa, bazada mavjudligi.
   * 3. Joriy teacher_name'larni to'ldirib qaytaradi.
   */
  private async validateAndEnrichSchedule(schedule?: DayScheduleDto): Promise<any | null> {
    if (!schedule) return null;

    const enrichedSchedule: any = {};
    const teacherIdsToFetch = new Set<string>();

    // 1. lesson_number takrorlanmasligini tekshirish va teacher_id larni yig'ish
    for (const [day, lessons] of Object.entries(schedule)) {
      if (!Array.isArray(lessons)) continue;

      const lessonNumbers = new Set<number>();
      for (const lesson of lessons as LessonSlotDto[]) {
        if (lessonNumbers.has(lesson.lesson_number)) {
          throw new BadRequestException(`${day} kunida ${lesson.lesson_number}-dars raqami takrorlangan.`);
        }
        lessonNumbers.add(lesson.lesson_number);

        if (lesson.teacher_id) {
          teacherIdsToFetch.add(lesson.teacher_id);
        }
      }
    }

    // 2. O'qituvchilarni bazadan olish
    const teacherNameMap = new Map<string, string>();
    if (teacherIdsToFetch.size > 0) {
      const teachers = await this.prisma.staffMember.findMany({
        where: { id: { in: Array.from(teacherIdsToFetch) } },
        select: { id: true, full_name_latin: true },
      });

      if (teachers.length !== teacherIdsToFetch.size) {
        const foundIds = new Set(teachers.map(t => t.id));
        const missingIds = Array.from(teacherIdsToFetch).filter(id => !foundIds.has(id));
        throw new BadRequestException(`Ko'rsatilgan o'qituvchi(lar) topilmadi: ${missingIds.join(', ')}`);
      }

      teachers.forEach(t => teacherNameMap.set(t.id, t.full_name_latin));
    }

    // 3. teacher_name ni to'ldirish
    for (const [day, lessons] of Object.entries(schedule)) {
      if (!Array.isArray(lessons)) continue;

      enrichedSchedule[day] = (lessons as LessonSlotDto[]).map(lesson => {
        const enrichedLesson: any = { ...lesson };
        if (lesson.teacher_id && teacherNameMap.has(lesson.teacher_id)) {
          enrichedLesson.teacher_name = teacherNameMap.get(lesson.teacher_id);
        }
        return enrichedLesson;
      });
    }

    return enrichedSchedule;
  }

  /**
   * O'qituvchi ismlarini berilgan map orqali almashtirish (StaffMember update uchun)
   */
  private syncTeacherNamesInSchedule(
    schedule: any,
    teacherNameMap: Map<string, string>,
  ): any {
    if (!schedule || typeof schedule !== 'object') return schedule;

    const updatedSchedule: any = {};
    for (const [day, lessons] of Object.entries(schedule)) {
      if (Array.isArray(lessons)) {
        updatedSchedule[day] = lessons.map((lesson: any) => {
          if (lesson.teacher_id && teacherNameMap.has(lesson.teacher_id)) {
            return { ...lesson, teacher_name: teacherNameMap.get(lesson.teacher_id) };
          }
          return lesson;
        });
      } else {
        updatedSchedule[day] = lessons;
      }
    }
    return updatedSchedule;
  }

  /**
   * O'qituvchining ismi o'zgarganda barcha faol jadvallarda ismni yangilaydi
   * (StaffService.update() tomonidan chaqiriladi)
   */
  async syncTeacherNamesForActiveSchedules(teacherId: string, newName: string): Promise<void> {
    try {
      // Barcha faol jadvallarni olamiz
      const activeSchedules = await this.prisma.classSchedule.findMany({
        where: { is_active: true },
      });

      const teacherNameMap = new Map<string, string>([[teacherId, newName]]);

      for (const schedule of activeSchedules) {
        if (!schedule.schedule) continue;

        // JSON ichidan qidirib ko'ramiz (optimallashtirish uchun)
        const scheduleStr = JSON.stringify(schedule.schedule);
        if (!scheduleStr.includes(teacherId)) continue; // Bu o'qituvchi bu jadvalda yo'q

        const updatedScheduleObj = this.syncTeacherNamesInSchedule(schedule.schedule, teacherNameMap);

        await this.prisma.classSchedule.update({
          where: { id: schedule.id },
          data: { schedule: updatedScheduleObj },
        });
      }
    } catch (error) {
      this.logger.error(`Failed to sync teacher name for active schedules (TeacherID: ${teacherId}): ${error.message}`);
    }
  }

  async create(creatorId: string, createDto: CreateClassScheduleDto) {
    const enrichedSchedule = await this.validateAndEnrichSchedule(createDto.schedule);

    const data: any = {
      grade: createDto.grade,
      start_date: createDto.start_date ? new Date(createDto.start_date) : null,
      end_date: createDto.end_date ? new Date(createDto.end_date) : null,
      is_active: createDto.is_active ?? true,
      schedule: enrichedSchedule,
      creator_id: creatorId,
    };

    if (data.is_active) {
      return this.prisma.$transaction(async (tx) => {
        // Shu grade uchun boshqa faol jadvallarni o'chirish
        await tx.classSchedule.updateMany({
          where: { grade: data.grade, is_active: true },
          data: { is_active: false },
        });
        return tx.classSchedule.create({ data, include: { creator: { select: { id: true, full_name: true } } } });
      });
    }

    return this.prisma.classSchedule.create({ data, include: { creator: { select: { id: true, full_name: true } } } });
  }

  async findAll(query: ClassScheduleQueryDto) {
    const { skip, take, page, limit } = buildPaginationParams(query as any);

    const where: any = {};
    if (query.grade) where.grade = query.grade;
    if (query.is_active !== undefined) where.is_active = query.is_active;

    const [data, total] = await Promise.all([
      this.prisma.classSchedule.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: 'desc' },
        include: { creator: { select: { id: true, full_name: true } } },
      }),
      this.prisma.classSchedule.count({ where }),
    ]);

    return buildPaginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    const schedule = await this.prisma.classSchedule.findUnique({
      where: { id },
      include: { creator: { select: { id: true, full_name: true } } },
    });
    if (!schedule) throw new NotFoundException('Dars jadvali topilmadi');
    return schedule;
  }

  async findOneActive(grade: string) {
    const schedule = await this.prisma.classSchedule.findFirst({
      where: { grade, is_active: true },
    });
    return schedule; // topilmasa bo'sh qaytadi
  }

  async update(id: string, updateDto: UpdateClassScheduleDto) {
    const existing = await this.prisma.classSchedule.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Dars jadvali topilmadi');

    const data: any = {};
    if (updateDto.grade !== undefined) data.grade = updateDto.grade;
    if (updateDto.start_date !== undefined) data.start_date = updateDto.start_date ? new Date(updateDto.start_date) : null;
    if (updateDto.end_date !== undefined) data.end_date = updateDto.end_date ? new Date(updateDto.end_date) : null;
    if (updateDto.is_active !== undefined) data.is_active = updateDto.is_active;

    if (updateDto.schedule !== undefined) {
      const enrichedNewSchedule = await this.validateAndEnrichSchedule(updateDto.schedule);
      const existingSchedule = (existing.schedule as object) || {};
      data.schedule = { ...existingSchedule, ...enrichedNewSchedule };
    }

    const targetGrade = data.grade || existing.grade;
    const isActivating = (data.is_active === true && existing.is_active === false) || (data.is_active === true && updateDto.schedule);

    if (isActivating) {
      return this.prisma.$transaction(async (tx) => {
        await tx.classSchedule.updateMany({
          where: { grade: targetGrade, is_active: true, NOT: { id } },
          data: { is_active: false },
        });
        return tx.classSchedule.update({ where: { id }, data, include: { creator: { select: { id: true, full_name: true } } } });
      });
    }

    return this.prisma.classSchedule.update({ where: { id }, data, include: { creator: { select: { id: true, full_name: true } } } });
  }

  async activate(id: string) {
    const existing = await this.prisma.classSchedule.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Dars jadvali topilmadi');

    return this.prisma.$transaction(async (tx) => {
      // 1-2. Shu grade bo'yicha boshqa faol jadvallarni o'chirish
      await tx.classSchedule.updateMany({
        where: { grade: existing.grade, is_active: true, NOT: { id } },
        data: { is_active: false },
      });

      // 3. Barcha teacher_id larni yig'ib olish
      const teacherIdsToFetch = new Set<string>();
      const scheduleObj = existing.schedule as any;

      if (scheduleObj && typeof scheduleObj === 'object') {
        for (const [day, lessons] of Object.entries(scheduleObj)) {
          if (Array.isArray(lessons)) {
            for (const lesson of lessons) {
              if (lesson.teacher_id) teacherIdsToFetch.add(lesson.teacher_id);
            }
          }
        }
      }

      // 4. Eng so'nggi ismlarni olish va to'ldirish
      let enrichedSchedule = scheduleObj;
      if (teacherIdsToFetch.size > 0) {
        const teachers = await tx.staffMember.findMany({
          where: { id: { in: Array.from(teacherIdsToFetch) } },
          select: { id: true, full_name_latin: true },
        });
        const teacherNameMap = new Map<string, string>();
        teachers.forEach(t => teacherNameMap.set(t.id, t.full_name_latin));

        enrichedSchedule = this.syncTeacherNamesInSchedule(scheduleObj, teacherNameMap);
      }

      // 5. Yozuvni yangilangan schedule va is_active: true bilan saqlash
      return tx.classSchedule.update({
        where: { id },
        data: { is_active: true, schedule: enrichedSchedule },
      });
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.classSchedule.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Dars jadvali topilmadi');

    await this.prisma.classSchedule.delete({ where: { id } });
    return { success: true };
  }

  async removeDay(id: string, day: string) {
    const existing = await this.prisma.classSchedule.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Dars jadvali topilmadi');

    const scheduleObj = (existing.schedule as Record<string, any>) || {};

    // Agar ko'rsatilgan kun mavjud bo'lsa, uni o'chirib tashlaymiz
    if (scheduleObj[day]) {
      delete scheduleObj[day];

      return this.prisma.classSchedule.update({
        where: { id },
        data: { schedule: scheduleObj },
        include: { creator: { select: { id: true, full_name: true } } },
      });
    } else {
      return {
        message: "Bu kun jadvalda mavjud emas!",
        status: 404
      }
    }
  }
}
