import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { AdmissionService } from './admission.service';
import { CreateAdmissionApplicationDto } from './dto/create-admission-application.dto';
import { UpdateAdmissionApplicationDto } from './dto/update-admission-application.dto';
import { QueryAdmissionApplicationDto } from './dto/query-admission-application.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles-auth-decorator';
import { UserRole } from '../core/database/generated';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UpdateAdminApplicationBodyDto } from './dto/update-admin-application-body.dto';

@ApiTags('Admission (Onlayn Qabul Arizalari)')
@Controller('admission')
export class AdmissionController {
  constructor(private readonly admissionService: AdmissionService) {}

  @Post('apply')
  @ApiOperation({ summary: 'Submit an admission application (Public)' })
  create(@Body() dto: CreateAdmissionApplicationDto) {
    return this.admissionService.create(dto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all admission applications (Admin only)' })
  findAll(@Query() query: QueryAdmissionApplicationDto) {
    return this.admissionService.findAll(query);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get an admission application by id (Admin only)' })
  findOne(@Param('id') id: string) {
    return this.admissionService.findOne(id);
  }

  @Patch('admin/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update application full data (Admin only)' })
  updateAdmin(@Param('id') id: string, @Body() dto: UpdateAdminApplicationBodyDto) {
    return this.admissionService.updateAdmin(id, dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update application status/comment (Admin only)' })
  update(@Param('id') id: string, @Body() dto: UpdateAdmissionApplicationDto) {
    return this.admissionService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete an admission application (Admin only)' })
  remove(@Param('id') id: string) {
    return this.admissionService.remove(id);
  }
}
