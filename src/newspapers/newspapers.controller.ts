import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UseInterceptors, UploadedFiles, Req } from '@nestjs/common';
import { NewspapersService } from './newspapers.service';
import { CreateNewspaperDto } from './dto/create-newspaper.dto';
import { UpdateNewspaperDto } from './dto/update-newspaper.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles-auth-decorator';
import { UserRole } from '../core/database/generated';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { imageFileFilter, imageLimits, pdfFileFilter, pdfLimits } from '../common/storage/multer.config';
import { BaseQueryDto } from '../common/dto/base-query.dto';

@ApiTags('Newspapers (Maktab Gazetasi)')
@Controller('newspapers')
export class NewspapersController {
  constructor(private readonly newspapersService: NewspapersService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'Create a newspaper issue (Admin/Editor)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'file', maxCount: 1 },
    { name: 'cover_image', maxCount: 1 },
  ]))
  create(
    @Req() req: any,
    @Body() dto: CreateNewspaperDto,
    @UploadedFiles() files?: { file?: Express.Multer.File[]; cover_image?: Express.Multer.File[] },
  ) {
    return this.newspapersService.create(
      req.user.id,
      dto,
      files?.file?.[0],
      files?.cover_image?.[0],
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all newspaper issues (Public)' })
  findAll(@Query() query: BaseQueryDto) {
    return this.newspapersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a newspaper issue by id (Public)' })
  findOne(@Param('id') id: string) {
    return this.newspapersService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'Update a newspaper issue (Admin/Editor)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'file', maxCount: 1 },
    { name: 'cover_image', maxCount: 1 },
  ]))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateNewspaperDto,
    @UploadedFiles() files?: { file?: Express.Multer.File[]; cover_image?: Express.Multer.File[] },
  ) {
    return this.newspapersService.update(
      id,
      dto,
      files?.file?.[0],
      files?.cover_image?.[0],
    );
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a newspaper issue (Admin only)' })
  remove(@Param('id') id: string) {
    return this.newspapersService.remove(id);
  }
}
