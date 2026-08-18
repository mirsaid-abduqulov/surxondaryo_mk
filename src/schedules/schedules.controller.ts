import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateClassScheduleDto } from './dto/create-class-schedule.dto';
import { UpdateClassScheduleDto } from './dto/update-class-schedule.dto';
import { QueryClassScheduleDto } from './dto/query-class-schedule.dto';
import { CreateBellScheduleDto } from './dto/create-bell-schedule.dto';
import { UpdateBellScheduleDto } from './dto/update-bell-schedule.dto';
import { CreateHolidayScheduleDto } from './dto/create-holiday-schedule.dto';
import { UpdateHolidayScheduleDto } from './dto/update-holiday-schedule.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles-auth-decorator';
import { UserRole } from '../core/database/generated';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { BaseQueryDto } from '../common/dto/base-query.dto';

@ApiTags('Schedules (Jadvallar)')
@Controller()
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  // ─── ClassSchedule ───────────────────────────────────────────────────────────

  @Post('class-schedules')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'Create a class schedule entry (Admin/Editor)' })
  createClassSchedule(@Body() dto: CreateClassScheduleDto) {
    return this.schedulesService.createClassSchedule(dto);
  }

  @Get('class-schedules')
  @ApiOperation({ summary: 'Get all class schedules (Public)' })
  findAllClassSchedules(@Query() query: QueryClassScheduleDto) {
    return this.schedulesService.findAllClassSchedules(query);
  }

  @Get('class-schedules/:id')
  @ApiOperation({ summary: 'Get class schedule by id (Public)' })
  findOneClassSchedule(@Param('id') id: string) {
    return this.schedulesService.findOneClassSchedule(id);
  }

  @Patch('class-schedules/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'Update a class schedule (Admin/Editor)' })
  updateClassSchedule(@Param('id') id: string, @Body() dto: UpdateClassScheduleDto) {
    return this.schedulesService.updateClassSchedule(id, dto);
  }

  @Delete('class-schedules/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a class schedule (Admin only)' })
  removeClassSchedule(@Param('id') id: string) {
    return this.schedulesService.removeClassSchedule(id);
  }

  // ─── BellSchedule ────────────────────────────────────────────────────────────

  @Post('bell-schedules')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: "Create a bell schedule entry (Admin/Editor)" })
  createBellSchedule(@Body() dto: CreateBellScheduleDto) {
    return this.schedulesService.createBellSchedule(dto);
  }

  @Get('bell-schedules')
  @ApiOperation({ summary: "Get all bell schedules (Public)" })
  @ApiQuery({ name: 'shift', required: false, type: Number, description: '1 yoki 2' })
  findAllBellSchedules(@Query('shift') shift?: string) {
    return this.schedulesService.findAllBellSchedules(shift ? Number(shift) : undefined);
  }

  @Get('bell-schedules/:id')
  @ApiOperation({ summary: "Get bell schedule by id (Public)" })
  findOneBellSchedule(@Param('id') id: string) {
    return this.schedulesService.findOneBellSchedule(id);
  }

  @Patch('bell-schedules/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: "Update a bell schedule (Admin/Editor)" })
  updateBellSchedule(@Param('id') id: string, @Body() dto: UpdateBellScheduleDto) {
    return this.schedulesService.updateBellSchedule(id, dto);
  }

  @Delete('bell-schedules/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: "Delete a bell schedule (Admin only)" })
  removeBellSchedule(@Param('id') id: string) {
    return this.schedulesService.removeBellSchedule(id);
  }

  // ─── HolidaySchedule ─────────────────────────────────────────────────────────

  @Post('holiday-schedules')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: "Create a holiday schedule (Admin/Editor)" })
  createHolidaySchedule(@Body() dto: CreateHolidayScheduleDto) {
    return this.schedulesService.createHolidaySchedule(dto);
  }

  @Get('holiday-schedules')
  @ApiOperation({ summary: "Get all holiday schedules (Public)" })
  findAllHolidaySchedules(@Query() query: BaseQueryDto) {
    return this.schedulesService.findAllHolidaySchedules(query);
  }

  @Get('holiday-schedules/:id')
  @ApiOperation({ summary: "Get holiday schedule by id (Public)" })
  findOneHolidaySchedule(@Param('id') id: string) {
    return this.schedulesService.findOneHolidaySchedule(id);
  }

  @Patch('holiday-schedules/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: "Update a holiday schedule (Admin/Editor)" })
  updateHolidaySchedule(@Param('id') id: string, @Body() dto: UpdateHolidayScheduleDto) {
    return this.schedulesService.updateHolidaySchedule(id, dto);
  }

  @Delete('holiday-schedules/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: "Delete a holiday schedule (Admin only)" })
  removeHolidaySchedule(@Param('id') id: string) {
    return this.schedulesService.removeHolidaySchedule(id);
  }
}
