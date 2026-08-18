import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { RequiredDocumentsService } from './required-documents.service';
import { CreateRequiredDocumentDto } from './dto/create-required-document.dto';
import { UpdateRequiredDocumentDto } from './dto/update-required-document.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles-auth-decorator';
import { UserRole } from '../core/database/generated';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { BaseQueryDto } from '../common/dto/base-query.dto';

@ApiTags('Required Documents (Qabul Hujjatlari)')
@Controller('required-documents')
export class RequiredDocumentsController {
  constructor(private readonly requiredDocumentsService: RequiredDocumentsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'Create a required document entry (Admin/Editor)' })
  create(@Body() dto: CreateRequiredDocumentDto) {
    return this.requiredDocumentsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all required documents (Public, active only)' })
  findAll(@Query() query: BaseQueryDto) {
    return this.requiredDocumentsService.findAll(query);
  }

  @Get('admin')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all required documents including inactive (Admin only)' })
  findAllAdmin(@Query() query: BaseQueryDto) {
    return this.requiredDocumentsService.findAllAdmin(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a required document by id (Public)' })
  findOne(@Param('id') id: string) {
    return this.requiredDocumentsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'Update a required document (Admin/Editor)' })
  update(@Param('id') id: string, @Body() dto: UpdateRequiredDocumentDto) {
    return this.requiredDocumentsService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a required document (Admin only)' })
  remove(@Param('id') id: string) {
    return this.requiredDocumentsService.remove(id);
  }
}
