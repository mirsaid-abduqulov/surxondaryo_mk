import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../core/database/prisma.service';
import { CreateAdmissionApplicationDto } from './dto/create-admission-application.dto';
import { UpdateAdmissionApplicationDto } from './dto/update-admission-application.dto';
import { QueryAdmissionApplicationDto } from './dto/query-admission-application.dto';
import { buildPaginationParams, buildPaginatedResponse } from '../common/helpers/pagination.helper';
import { UpdateAdminApplicationBodyDto } from './dto/update-admin-application-body.dto';

@Injectable()
export class AdmissionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAdmissionApplicationDto) {
    return this.prisma.admissionApplication.create({
      data: {
        student_full_name: dto.student_full_name,
        birth_date: new Date(dto.birth_date),
        grade_applying: dto.grade_applying,
        parent_full_name: dto.parent_full_name,
        parent_phone: dto.parent_phone,
        parent_email: dto.parent_email,
        address: dto.address,
        previous_school: dto.previous_school,
        message: dto.message,
      },
    });
  }

  async findAll(query: QueryAdmissionApplicationDto) {
    const { skip, take, page, limit } = buildPaginationParams(query);

    const where: any = {};
    if (query.status) where.status = query.status;

    if (query.search) {
      where.OR = [
        { student_full_name: { contains: query.search, mode: 'insensitive' } },
        { parent_full_name: { contains: query.search, mode: 'insensitive' } },
        { parent_phone: { contains: query.search, mode: 'insensitive' } },
        { grade_applying: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.admissionApplication.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.admissionApplication.count({ where }),
    ]);

    return buildPaginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    const item = await this.prisma.admissionApplication.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Ariza topilmadi');
    return item;
  }

  async update(id: string, dto: UpdateAdmissionApplicationDto) {
    await this.findOne(id);
    return this.prisma.admissionApplication.update({
      where: { id },
      data: { ...dto },
    });
  }

  async updateAdmin(id: string, dto: UpdateAdminApplicationBodyDto) {
    await this.findOne(id);
    return this.prisma.admissionApplication.update({
      where: { id },
      data: { ...dto },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.admissionApplication.delete({ where: { id } });
    return { success: true };
  }
}
