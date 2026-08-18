import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { AppealsService } from './appeals.service';
import { CreateDirectorAppealDto } from './dto/create-director-appeal.dto';
import { UpdateDirectorAppealDto } from './dto/update-director-appeal.dto';
import { QueryDirectorAppealDto } from './dto/query-director-appeal.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles-auth-decorator';
import { UserRole } from '../core/database/generated';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Appeals (Direktor Qabulxonasiga Murojaatlar)')
@Controller('appeals')
export class AppealsController {
  constructor(private readonly appealsService: AppealsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a director appeal (Public)' })
  create(@Body() dto: CreateDirectorAppealDto) {
    return this.appealsService.create(dto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all director appeals (Admin only)' })
  findAll(@Query() query: QueryDirectorAppealDto) {
    return this.appealsService.findAll(query);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get a director appeal by id (Admin only)' })
  findOne(@Param('id') id: string) {
    return this.appealsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Answer or update status of an appeal (Admin only)' })
  update(@Param('id') id: string, @Body() dto: UpdateDirectorAppealDto) {
    return this.appealsService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a director appeal (Admin only)' })
  remove(@Param('id') id: string) {
    return this.appealsService.remove(id);
  }
}
