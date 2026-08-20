import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { PrismaService } from '../core/database/prisma.service';
import { StorageService } from '../common/storage/storage.service';
import { buildPaginationParams, buildPaginatedResponse } from '../common/helpers/pagination.helper';
import { ClubQueryDto } from './dto/club-query.dto';

@Injectable()
export class ClubsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async create(creator_id: string, createClubDto: CreateClubDto, imageFile?: Express.Multer.File) {
    let imageUrl: string | null = null;
    if (imageFile) {
      try {
        const saved = await this.storageService.saveFile(imageFile, 'clubs');
        imageUrl = saved.url;
      } catch (error) {
        throw new BadRequestException('Rasmni saqlashda xato: ' + error.message);
      }
    }

    try {
      const start_date = createClubDto.start_date ? new Date(createClubDto.start_date) : null;
      const end_date = createClubDto.end_date ? new Date(createClubDto.end_date) : null;

      const club = await this.prisma.club.create({
        data: {
          name_latin: createClubDto.name_latin,
          name_cyril: createClubDto.name_cyril,
          name_ru: createClubDto.name_ru,
          category: createClubDto.category,
          start_date,
          end_date,
          description_latin: createClubDto.description_latin || null,
          description_cyril: createClubDto.description_cyril || null,
          description_ru: createClubDto.description_ru || null,
          supervisor_name: createClubDto.supervisor_name || null,
          age_group: createClubDto.age_group || null,
          location: createClubDto.location || null,
          is_active: createClubDto.is_active ?? true,
          schedule: createClubDto.schedule ? JSON.parse(JSON.stringify(createClubDto.schedule)) : null,
          cover_image: imageUrl,
          creator_id,
        },
      });
      return club;
    } catch (error) {
      if (imageUrl) {
        await this.storageService.deleteFile(imageUrl);
      }
      throw error;
    }
  }

  async findAll(query: ClubQueryDto, is_active?: boolean) {
    const { skip, take, page, limit } = buildPaginationParams(query);
    const where: any = {};

    if (is_active === true) {
      where.is_active = true;
    }
    if (is_active === false) {
      where.is_active = false;
    }

    if (query.category) {
      where.category = query.category;
    }

    if (query.age_group) {
      where.age_group = query.age_group;
    }

    if (query.search) {
      where.OR = [
        { name_latin: { contains: query.search, mode: 'insensitive' } },
        { name_cyril: { contains: query.search, mode: 'insensitive' } },
        { name_ru: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [clubs, total] = await Promise.all([
      this.prisma.club.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: 'desc' },
        include: {
          creator: {
            select: {
              id: true,
              full_name: true,
            }
          }
        }
      }),
      this.prisma.club.count({ where }),
    ]);

    return buildPaginatedResponse(clubs, total, page, limit);
  }

  async findOne(id: string, forceActiveOnly = false) {
    const where: any = { id };
    if (forceActiveOnly) {
      where.is_active = true;
    }

    const club = await this.prisma.club.findFirst({
      where,
      include: {
        creator: {
          select: {
            id: true,
            full_name: true,
          }
        }
      }
    });

    if (!club) throw new NotFoundException('To\'garak topilmadi');
    return club;
  }

  async update(id: string, updateClubDto: UpdateClubDto, imageFile?: Express.Multer.File) {
    const club = await this.prisma.club.findUnique({ where: { id } });
    if (!club) throw new NotFoundException('To\'garak topilmadi');

    let newImageUrl: string | null = null;
    if (imageFile) {
      try {
        const saved = await this.storageService.replaceFile(club.cover_image, imageFile, 'clubs');
        newImageUrl = saved.url;
      } catch (error) {
        throw new BadRequestException('Rasmni saqlashda xato: ' + error.message);
      }
    }

    const data: any = {};
    if (updateClubDto.name_latin !== undefined) data.name_latin = updateClubDto.name_latin;
    if (updateClubDto.name_cyril !== undefined) data.name_cyril = updateClubDto.name_cyril;
    if (updateClubDto.name_ru !== undefined) data.name_ru = updateClubDto.name_ru;
    if (updateClubDto.category !== undefined) data.category = updateClubDto.category;
    
    if (updateClubDto.start_date !== undefined) data.start_date = updateClubDto.start_date ? new Date(updateClubDto.start_date) : null;
    if (updateClubDto.end_date !== undefined) data.end_date = updateClubDto.end_date ? new Date(updateClubDto.end_date) : null;
    
    if (updateClubDto.description_latin !== undefined) data.description_latin = updateClubDto.description_latin || null;
    if (updateClubDto.description_cyril !== undefined) data.description_cyril = updateClubDto.description_cyril || null;
    if (updateClubDto.description_ru !== undefined) data.description_ru = updateClubDto.description_ru || null;
    
    if (updateClubDto.supervisor_name !== undefined) data.supervisor_name = updateClubDto.supervisor_name || null;
    if (updateClubDto.age_group !== undefined) data.age_group = updateClubDto.age_group || null;
    if (updateClubDto.location !== undefined) data.location = updateClubDto.location || null;
    if (updateClubDto.is_active !== undefined) data.is_active = updateClubDto.is_active;
    if (updateClubDto.schedule !== undefined) {
      const parsedSchedule = updateClubDto.schedule ? JSON.parse(JSON.stringify(updateClubDto.schedule)) : null;
      
      if (parsedSchedule && typeof parsedSchedule === 'object' && club.schedule && typeof club.schedule === 'object') {
        data.schedule = {
          ...(club.schedule as object),
          ...parsedSchedule,
        };
      } else {
        data.schedule = parsedSchedule;
      }
    }

    if (newImageUrl) {
      data.cover_image = newImageUrl;
    }

    try {
      const updated = await this.prisma.club.update({
        where: { id },
        data,
      });
      return updated;
    } catch (error) {
      if (newImageUrl) {
        await this.storageService.deleteFile(newImageUrl);
      }
      throw error;
    }
  }

  async remove(id: string) {
    const club = await this.prisma.club.findUnique({ where: { id } });
    if (!club) throw new NotFoundException('To\'garak topilmadi');

    await this.prisma.club.delete({ where: { id } });

    if (club.cover_image) {
      await this.storageService.deleteFile(club.cover_image);
    }

    return { success: true };
  }

  async updateScheduleDay(id: string, day: string, slots: any[]) {
    const club = await this.prisma.club.findUnique({ where: { id } });
    if (!club) throw new NotFoundException('To\'garak topilmadi');

    const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    if (!validDays.includes(day.toLowerCase())) {
      throw new BadRequestException('Noto\'g\'ri kun kiritildi');
    }

    let currentSchedule = (club.schedule as Record<string, any>) || {};
    currentSchedule[day.toLowerCase()] = slots;

    return this.prisma.club.update({
      where: { id },
      data: { schedule: currentSchedule },
    });
  }

  async removeScheduleDay(id: string, day: string) {
    const club = await this.prisma.club.findUnique({ where: { id } });
    if (!club) throw new NotFoundException('To\'garak topilmadi');

    let currentSchedule = (club.schedule as Record<string, any>) || {};
    const dayKey = day.toLowerCase();

    if (currentSchedule.hasOwnProperty(dayKey)) {
      delete currentSchedule[dayKey];
      return this.prisma.club.update({
        where: { id },
        data: { schedule: currentSchedule },
      });
    }else{
      throw new BadRequestException('Bu kun uchun to\'garak mavjud emas');
    }
  }
}
