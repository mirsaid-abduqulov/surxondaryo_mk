import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { ClubsService } from './clubs.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { ClubQueryDto } from './dto/club-query.dto';
import { UpdateScheduleDayDto } from './dto/schedule.dto';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiConsumes, ApiParam } from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles-auth-decorator';
import { UserRole, WeekDay } from '../core/database/generated';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter, imageLimits } from '../common/storage/multer.config';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Clubs (To\'garaklar)')
@Controller('clubs')
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @Get('public')
  @ApiOperation({ summary: 'Get all active clubs (Public)' })
  findAllPublic(@Query() query: ClubQueryDto) {
    return this.clubsService.findAll(query, true);
  }

  @Get('public/:id')
  @ApiOperation({ summary: 'Get active club by id (Public)' })
  findOnePublic(@Param('id') id: string) {
    return this.clubsService.findOne(id, true);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new club (Admin only)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('cover_image', {
    fileFilter: imageFileFilter,
    limits: imageLimits,
  }))
  create(
    @Req() req: any,
    @Body() createClubDto: CreateClubDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.clubsService.create(req.user.id, createClubDto, file);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all clubs (Admin only)' })
  findAll(@Query() query: ClubQueryDto) {
    return this.clubsService.findAll(query, false);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get club by id (Admin only)' })
  findOne(@Param('id') id: string) {
    return this.clubsService.findOne(id, false);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update a club (Admin only)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('cover_image', {
    fileFilter: imageFileFilter,
    limits: imageLimits,
  }))
  update(
    @Param('id') id: string,
    @Body() updateClubDto: UpdateClubDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.clubsService.update(id, updateClubDto, file);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a club (Admin only)' })
  remove(@Param('id') id: string) {
    return this.clubsService.remove(id);
  }

  @Patch(':id/schedule/:day')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiParam({
    name: 'day',
    schema:{
      type:'string',
      enum:Object.values(WeekDay)
    }
    })
  @ApiOperation({ summary: 'Add or update a specific day in club schedule (Admin only)' })
  updateScheduleDay(
    @Param('id') id: string,
    @Param('day') day: string,
    @Body() updateScheduleDayDto: UpdateScheduleDayDto,
  ) {
    return this.clubsService.updateScheduleDay(id, day, updateScheduleDayDto.slots);
  }

  @Delete(':id/schedule/:day')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiParam({
    name: 'day',
    schema:{
      type:'string',
      enum:Object.values(WeekDay)
    }
    })
  @ApiOperation({ summary: 'Delete a specific day from club schedule (Admin only)' })
  removeScheduleDay(
    @Param('id') id: string,
    @Param('day') day: string,
  ) {
    return this.clubsService.removeScheduleDay(id, day);
  }
}
