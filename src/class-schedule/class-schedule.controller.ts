import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ClassScheduleService } from './class-schedule.service';
import { CreateClassScheduleDto } from './dto/create-class-schedule.dto';
import { UpdateClassScheduleDto } from './dto/update-class-schedule.dto';
import { ClassScheduleQueryDto } from './dto/class-schedule-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles-auth-decorator';
import { UserRole, WeekDay } from '../core/database/generated';

@ApiTags('Class Schedule (Dars jadvali)')
@Controller('class-schedule')
export class ClassScheduleController {
  constructor(private readonly classScheduleService: ClassScheduleService) {}

  @Get('public')
  @ApiOperation({ summary: 'Bitta sinf uchun faol dars jadvalini olish (Public)' })
  findOnePublic(@Query('grade') grade: string) {
    if (!grade) {
      return null;
    }
    return this.classScheduleService.findOneActive(grade);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Yangi dars jadvali yaratish' })
  create(@Req() req: any, @Body() createDto: CreateClassScheduleDto) {
    return this.classScheduleService.create(req.user.id, createDto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Barcha dars jadvallarini olish (Admin)' })
  findAll(@Query() query: ClassScheduleQueryDto) {
    return this.classScheduleService.findAll(query);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'ID orqali dars jadvalini olish (Admin)' })
  findOne(@Param('id') id: string) {
    return this.classScheduleService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Dars jadvalini yangilash' })
  update(@Param('id') id: string, @Body() updateDto: UpdateClassScheduleDto) {
    return this.classScheduleService.update(id, updateDto);
  }

  @Patch(':id/activate')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Jadvalni faollashtirish (sinxronlash bilan birga)' })
  activate(@Param('id') id: string) {
    return this.classScheduleService.activate(id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Dars jadvalini butunlay o\'chirish (Admin)' })
  remove(@Param('id') id: string) {
    return this.classScheduleService.remove(id);
  }

  @Delete(':id/day/:day')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Dars jadvalidan ma\'lum bir kunni o\'chirish (Admin)' })
  @ApiParam({
     name: 'day',
     schema:{
       type:'string',
       enum:Object.values(WeekDay)
     }
     })
  removeDay(@Param('id') id: string, @Param('day') day: string) {
    return this.classScheduleService.removeDay(id, day.toLowerCase());
  }
}
