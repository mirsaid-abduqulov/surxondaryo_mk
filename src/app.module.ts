import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './core/database/prsima.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { StorageModule } from './common/storage/storage.module';

import { ScheduleModule } from '@nestjs/schedule';
import { BannersModule } from './banners/banners.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { UsefulLinksModule } from './useful-links/useful-links.module';
import { PagesModule } from './pages/pages.module';
import { NewsModule } from './news/news.module';
import { EventsModule } from './events/events.module';
import { DocumentsModule } from './documents/documents.module';
import { MediaModule } from './media/media.module';
import { ContactModule } from './contact/contact.module';
import { StaffModule } from './staff/staff.module';
import { ClubsModule } from './clubs/clubs.module';

import { CanteenMenuModule } from './canteen-menu/canteen-menu.module';
import { MeetingsModule } from './meetings/meetings.module';
import { AdmissionModule } from './admission/admission.module';
import { RequiredDocumentsModule } from './required-documents/required-documents.module';
import { AppealsModule } from './appeals/appeals.module';
import { NewspapersModule } from './newspapers/newspapers.module';
import { ClassScheduleModule } from './class-schedule/class-schedule.module';

@Module({
  imports: [
    PrismaModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    AuthModule,
    StorageModule,
    UsersModule,
    BannersModule,
    AnnouncementsModule,
    UsefulLinksModule,
    PagesModule,
    StaffModule,
    NewsModule,
    EventsModule,
    DocumentsModule,
    MediaModule,
    ContactModule,
    ClubsModule,

    CanteenMenuModule,
    MeetingsModule,
    AdmissionModule,
    RequiredDocumentsModule,
    AppealsModule,
    NewspapersModule,
    ClassScheduleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
