import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UseInterceptors, UploadedFile, Req, ForbiddenException } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventsDto } from './dto/create-events.dto';
import { UpdateEventsDto } from './dto/update-events.dto';
import { QueryEventsDto } from './dto/query-events.dto';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles-auth-decorator';
import { UserRole } from '../core/database/generated';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter, imageLimits } from '../common/storage/multer.config';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';


@ApiTags('Events(Tadbirlar)')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) { }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new events' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('cover_image', {
    fileFilter: imageFileFilter,
    limits: imageLimits,
  }))
  create(
    @Req() req: any,
    @Body() createDto: CreateEventsDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.eventsService.create(req.user.id, createDto, file);
  }

  @Get()
  @ApiOperation({ summary: 'Get all events (Public)' })
  findAll(@Query() query: QueryEventsDto) {
    return this.eventsService.findAll(query, true);
  }


  @Get('admin')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all events' })
  @ApiQuery({ name: 'is_public', required: false, type: Boolean })
  findAll_admin(@Query() query: QueryEventsDto, @Query() is_public?: boolean) {
    return this.eventsService.findAll(query, is_public);
  }

  @Get('admin/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get events by id' })
  findOne_admin(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get events by id (Public)' })
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id, true);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update a events' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('cover_image', {
    fileFilter: imageFileFilter,
    limits: imageLimits,
  }))
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateEventsDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.eventsService.update(id, updateDto, file);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a events (Admin only)' })
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
