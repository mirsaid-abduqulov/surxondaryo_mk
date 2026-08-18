import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateCanteenMenuDto } from './dto/create-canteen-menu.dto';
import { UpdateCanteenMenuDto } from './dto/update-canteen-menu.dto';
import { PrismaService } from 'src/core/database/prisma.service';
import { StorageService } from 'src/common/storage/storage.service';
import { buildPaginationParams, buildPaginatedResponse } from 'src/common/helpers/pagination.helper';
import { CanteenMenuQueryDto } from './dto/canteen-menu-query.dto';
import { DayMenuDto } from './dto/day-menu.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class CanteenMenuService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  private assignFoodItemIds(dayMenu: DayMenuDto | undefined): any | undefined {
    if (!dayMenu) return undefined;
    
    const processedDayMenu: any = { ...dayMenu };

    const slots = ['breakfast', 'lunch', 'snack'] as const;
    for (const slot of slots) {
      if (processedDayMenu[slot] && processedDayMenu[slot].foods) {
        processedDayMenu[slot].foods = processedDayMenu[slot].foods.map((food: any) => {
          if (!food.id) {
            food.id = randomUUID();
          }
          return food;
        });
      }
    }

    return processedDayMenu;
  }

  async create(createDto: CreateCanteenMenuDto) {
    const monday = this.assignFoodItemIds(createDto.monday);
    const tuesday = this.assignFoodItemIds(createDto.tuesday);
    const wednesday = this.assignFoodItemIds(createDto.wednesday);
    const thursday = this.assignFoodItemIds(createDto.thursday);
    const friday = this.assignFoodItemIds(createDto.friday);
    const saturday = this.assignFoodItemIds(createDto.saturday);

    const data = {
      start_date: new Date(createDto.start_date),
      end_date: createDto.end_date ? new Date(createDto.end_date) : null,
      is_active: createDto.is_active ?? false,
      monday: monday ?? null,
      tuesday: tuesday ?? null,
      wednesday: wednesday ?? null,
      thursday: thursday ?? null,
      friday: friday ?? null,
      saturday: saturday ?? null,
    };

    if (data.is_active) {
      return this.prisma.$transaction(async (tx) => {
        await tx.canteenMenu.updateMany({
          where: { is_active: true },
          data: { is_active: false },
        });
        return tx.canteenMenu.create({ data });
      });
    }

    return this.prisma.canteenMenu.create({ data });
  }

  async findAll(query: CanteenMenuQueryDto) {
    const { skip, take, page, limit } = buildPaginationParams(query);

    const where: any = {};
    if (query.start_date) {
      where.start_date = { gte: new Date(query.start_date) };
    }
    if (query.end_date) {
      where.end_date = { lte: new Date(query.end_date) };
    }

    const [menus, total] = await Promise.all([
      this.prisma.canteenMenu.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.canteenMenu.count({ where }),
    ]);

    return buildPaginatedResponse(menus, total, page, limit);
  }

  async findOneActive() {
    const menu = await this.prisma.canteenMenu.findFirst({
      where: { is_active: true },
    });
    return menu; // null qaytishi ham kutilgan holat
  }

  async findOne(id: string) {
    const menu = await this.prisma.canteenMenu.findUnique({
      where: { id },
    });
    if (!menu) throw new NotFoundException('Oshxona menyusi topilmadi');
    return menu;
  }

  async update(id: string, updateDto: UpdateCanteenMenuDto) {
    const menu = await this.prisma.canteenMenu.findUnique({ where: { id } });
    if (!menu) throw new NotFoundException('Oshxona menyusi topilmadi');

    const data: any = {};

    if (updateDto.start_date !== undefined) data.start_date = new Date(updateDto.start_date);
    if (updateDto.end_date !== undefined) data.end_date = updateDto.end_date ? new Date(updateDto.end_date) : null;
    if (updateDto.is_active !== undefined) data.is_active = updateDto.is_active;

    if (updateDto.monday !== undefined) data.monday = this.assignFoodItemIds(updateDto.monday) ?? null;
    if (updateDto.tuesday !== undefined) data.tuesday = this.assignFoodItemIds(updateDto.tuesday) ?? null;
    if (updateDto.wednesday !== undefined) data.wednesday = this.assignFoodItemIds(updateDto.wednesday) ?? null;
    if (updateDto.thursday !== undefined) data.thursday = this.assignFoodItemIds(updateDto.thursday) ?? null;
    if (updateDto.friday !== undefined) data.friday = this.assignFoodItemIds(updateDto.friday) ?? null;
    if (updateDto.saturday !== undefined) data.saturday = this.assignFoodItemIds(updateDto.saturday) ?? null;

    if (data.is_active) {
      return this.prisma.$transaction(async (tx) => {
        await tx.canteenMenu.updateMany({
          where: { is_active: true, NOT: { id } },
          data: { is_active: false },
        });
        return tx.canteenMenu.update({ where: { id }, data });
      });
    }

    return this.prisma.canteenMenu.update({ where: { id }, data });
  }

  async remove(id: string) {
    const menu = await this.prisma.canteenMenu.findUnique({ where: { id } });
    if (!menu) throw new NotFoundException('Oshxona menyusi topilmadi');

    // Bu yerda menyu ichidagi rasmlarni o'chirish logikasi kerak bo'lsa qo'shish mumkin
    await this.prisma.canteenMenu.delete({ where: { id } });
    return { success: true };
  }

  async activate(id: string) {
    const menu = await this.prisma.canteenMenu.findUnique({ where: { id } });
    if (!menu) throw new NotFoundException('Oshxona menyusi topilmadi');

    return this.prisma.$transaction(async (tx) => {
      await tx.canteenMenu.updateMany({
        where: { is_active: true, NOT: { id } },
        data: { is_active: false },
      });
      return tx.canteenMenu.update({
        where: { id },
        data: { is_active: true },
      });
    });
  }

  async updateFoodImage(menuId: string, foodItemId: string, imageFile: Express.Multer.File) {
    const menu = await this.prisma.canteenMenu.findUnique({ where: { id: menuId } });
    if (!menu) throw new NotFoundException('Oshxona menyusi topilmadi');

    let foodItemFound = false;
    let dayToUpdate: string | null = null;
    let updatedDayMenu: any = null;

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
    const slots = ['breakfast', 'lunch', 'snack'] as const;

    for (const day of days) {
      const dayMenu = menu[day] as any;
      if (!dayMenu) continue;

      for (const slot of slots) {
        if (dayMenu[slot] && dayMenu[slot].foods) {
          const foodItem = dayMenu[slot].foods.find((f: any) => f.id === foodItemId);
          if (foodItem) {
            foodItemFound = true;
            dayToUpdate = day;
            updatedDayMenu = dayMenu; // modified in place
            
            let imageUrl: string;
            try {
              if (foodItem.image_url) {
                // Avvalgi rasmni almashtiramiz yoki qaytadan yozamiz
                // Loyihadagi storageService qanday ishlashiga bog'liq, hozircha yangi yuklaymiz 
                // va eskisini o'chiramiz.
                const saved = await this.storageService.saveFile(imageFile, 'canteen-menu');
                imageUrl = saved.url;
                await this.storageService.deleteFile(foodItem.image_url).catch(() => {});
              } else {
                const saved = await this.storageService.saveFile(imageFile, 'canteen-menu');
                imageUrl = saved.url;
              }
              foodItem.image_url = imageUrl;
            } catch (error) {
              throw new BadRequestException('Rasmni yuklashda xato: ' + error.message);
            }
            break;
          }
        }
      }
      if (foodItemFound) break;
    }

    if (!foodItemFound) {
      throw new NotFoundException('Taom topilmadi');
    }

    // Saqlaymiz
    const updatedMenu = await this.prisma.canteenMenu.update({
      where: { id: menuId },
      data: {
        [dayToUpdate as string]: updatedDayMenu,
      },
    });

    return updatedMenu;
  }
}
