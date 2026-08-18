import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { UsefulLinksService } from './useful-links.service';
import { CreateUsefulLinkDto } from './dto/create-useful-link.dto';
import { UpdateUsefulLinkDto } from './dto/update-useful-link.dto';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles-auth-decorator';
import { UserRole } from '../core/database/generated';
import { BaseQueryDto } from '../common/dto/base-query.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@ApiTags('Useful Links(Foydali linklar)')
@Controller('useful-links')
export class UsefulLinksController {
  constructor(private readonly usefulLinksService: UsefulLinksService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'Create a new useful link' })
  create(@Body() createUsefulLinkDto: CreateUsefulLinkDto) {
    return this.usefulLinksService.create(createUsefulLinkDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active useful links (Public)' })
  findAllActive(@Query() query: BaseQueryDto) {
    return this.usefulLinksService.findAllActive(query);
  }

  @Get('all')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'Get all useful links (Admin only)' })
  findAll(@Query() query: BaseQueryDto) {
    return this.usefulLinksService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a useful link by id (Public)' })
  findOne(@Param('id') id: string) {
    return this.usefulLinksService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'Update a useful link' })
  update(@Param('id') id: string, @Body() updateUsefulLinkDto: UpdateUsefulLinkDto) {
    return this.usefulLinksService.update(id, updateUsefulLinkDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a useful link' })
  remove(@Param('id') id: string) {
    return this.usefulLinksService.remove(id);
  }
}
