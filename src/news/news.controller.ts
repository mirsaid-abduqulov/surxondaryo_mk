import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UseInterceptors, UploadedFile, Req, StreamableFile, Res, ForbiddenException } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { QueryNewsDto } from './dto/query-news.dto';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles-auth-decorator';
import { UserRole } from '../core/database/generated';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter, imageLimits } from '../common/storage/multer.config';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';


@ApiTags('News(Yangiliklar)')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) { }

  // @Post()
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  // @ApiOperation({ summary: 'Create a new news' })
  // @ApiConsumes('multipart/form-data')
  // @UseInterceptors(FileInterceptor('cover_image', {
  //   fileFilter: imageFileFilter,
  //   limits: imageLimits,
  // }))
  // create(
  //   @Req() req: any,
  //   @Body() createDto: CreateNewsDto,
  //   @UploadedFile() file?: Express.Multer.File,
  // ) {
  //   return this.newsService.create(req.user.id, createDto, file);
  // }

  // @Get('public')
  // @ApiOperation({ summary: 'Get all news (Public)' })
  // findAllPublic(@Query() query: QueryNewsDto, @Req() req: any) {
  //   return this.newsService.findAll(query, true);
  // }

  // @Get('public/:id')
  // @ApiOperation({ summary: 'Get news by id (Public)' })
  // findOnePublic(@Param('id') id: string) {
  //   return this.newsService.findOne(id, true);
  // }

  // @Get()
  // @ApiOperation({ summary: 'Get all news' })
  // findAll(@Query() query: QueryNewsDto, @Req() req: any) {
  //  const role = req.user.role;
  //   if (![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(role)) {
  //     throw new ForbiddenException('Siz ushbu resursdan foydalanishga ruxsat berilmadi');
  //   }
  //   return this.newsService.findAll(query);
  // }

  // @Get(':id/admin')
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  // @ApiOperation({ summary: 'Get news by id (Admin)' })
  // findOneAdmin(@Param('id') id: string, @Req() req: any) {
  //   const role = req.user.role;
  //   if (![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(role)) {
  //     throw new ForbiddenException('Siz ushbu resursdan foydalanishga ruxsat berilmadi');
  //   }
  //   return this.newsService.findOne(id);
  // }



  // @Patch(':id')
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  // @ApiOperation({ summary: 'Update a news' })
  // @ApiConsumes('multipart/form-data')
  // @UseInterceptors(FileInterceptor('cover_image', {
  //   fileFilter: imageFileFilter,
  //   limits: imageLimits,
  // }))
  // update(
  //   @Param('id') id: string,
  //   @Body() updateDto: UpdateNewsDto,
  //   @UploadedFile() file?: Express.Multer.File,
  // ) {
  //   return this.newsService.update(id, updateDto, file);
  // }

  // @Delete(':id')
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  // @ApiOperation({ summary: 'Delete a news (Admin only)' })
  // remove(@Param('id') id: string) {
  //   return this.newsService.remove(id);
  // }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new news' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('cover_image', {
    fileFilter: imageFileFilter,
    limits: imageLimits,
  }))
  create(
    @Req() req: any,
    @Body() createDto: CreateNewsDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.newsService.create(req.user.id, createDto, file);
  }

  @Get()
  @ApiOperation({ summary: 'Get all news (Public)' })
  findAll(@Query() query: QueryNewsDto, @Req() req: any) {
    return this.newsService.findAll(query,true);
  }

  @Get('admin')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all news (Admin)' })
  findAllAdmin(@Query() query: QueryNewsDto, @Req() req: any, @Query() is_public?: boolean) {
    const role = req.user.role;
    if (![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(role)) {
      throw new ForbiddenException('Siz ushbu resursdan foydalanishga ruxsat berilmadi');
    }
    return this.newsService.findAll(query, is_public);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get news by id (Public)' })
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(id, true);
  }

  @Get(':id/admin')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get news by id (Admin)' })
  findOneAdmin(@Param('id') id: string, @Req() req: any) {
    const role = req.user.role;
    if (![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(role)) {
      throw new ForbiddenException('Siz ushbu resursdan foydalanishga ruxsat berilmadi');
    }
    return this.newsService.findOne(id);
  }



  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update a news' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('cover_image', {
    fileFilter: imageFileFilter,
    limits: imageLimits,
  }))
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateNewsDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.newsService.update(id, updateDto, file);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a news (Admin only)' })
  remove(@Param('id') id: string) {
    return this.newsService.remove(id);
  }
}
