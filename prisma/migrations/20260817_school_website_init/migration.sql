-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'EDITOR');

-- CreateEnum
CREATE TYPE "StaffCategory" AS ENUM ('DIRECTOR', 'DEPUTY_DIRECTOR', 'TEACHER', 'ADMINISTRATION', 'OTHER');

-- CreateEnum
CREATE TYPE "ClubCategory" AS ENUM ('SPORT', 'SCIENCE', 'ART', 'LANGUAGE', 'TECHNOLOGY', 'MUSIC', 'OTHER');

-- CreateEnum
CREATE TYPE "WeekDay" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('BREAKFAST', 'LUNCH', 'SNACK');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AppealStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'ANSWERED');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('SCHOOL_EVENT', 'HOLIDAY', 'COMPETITION', 'OTHER');

-- CreateEnum
CREATE TYPE "DocumentCategory" AS ENUM ('CHARTER', 'LICENSE', 'SELF_ASSESSMENT', 'ORDER', 'REPORT', 'OTHER');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('PHOTO', 'VIDEO', 'PRESENTATION');

-- CreateEnum
CREATE TYPE "PageSlug" AS ENUM ('ABOUT', 'ADMISSION_REQUIREMENTS', 'PRIVACY_POLICY', 'TERMS_OF_SERVICE', 'FAQ', 'RULES', 'CONTACTS');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "email" TEXT,
    "full_name" TEXT NOT NULL,
    "hashed_password" TEXT NOT NULL,
    "hashed_refresh_token" TEXT,
    "refresh_token_jti" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'EDITOR',
    "is_login" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffMember" (
    "id" TEXT NOT NULL,
    "full_name_latin" TEXT NOT NULL,
    "full_name_cyril" TEXT NOT NULL,
    "full_name_ru" TEXT NOT NULL,
    "category" "StaffCategory" NOT NULL,
    "position_latin" TEXT NOT NULL,
    "position_cyril" TEXT NOT NULL,
    "position_ru" TEXT NOT NULL,
    "subject_latin" TEXT,
    "subject_cyril" TEXT,
    "subject_ru" TEXT,
    "bio_latin" TEXT,
    "bio_cyril" TEXT,
    "bio_ru" TEXT,
    "photo_url" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "reception_days" TEXT,
    "degree_latin" TEXT,
    "degree_cyril" TEXT,
    "degree_ru" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "creator_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Club" (
    "id" TEXT NOT NULL,
    "name_latin" TEXT NOT NULL,
    "name_cyril" TEXT NOT NULL,
    "name_ru" TEXT NOT NULL,
    "category" "ClubCategory" NOT NULL,
    "description_latin" TEXT,
    "description_cyril" TEXT,
    "description_ru" TEXT,
    "supervisor_name" TEXT,
    "age_group" TEXT,
    "schedule_latin" TEXT,
    "schedule_cyril" TEXT,
    "schedule_ru" TEXT,
    "location" TEXT,
    "cover_image" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "creator_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Club_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassSchedule" (
    "id" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "day" "WeekDay" NOT NULL,
    "lesson_number" INTEGER NOT NULL,
    "subject_latin" TEXT NOT NULL,
    "subject_cyril" TEXT NOT NULL,
    "subject_ru" TEXT NOT NULL,
    "teacher_name" TEXT,
    "room" TEXT,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BellSchedule" (
    "id" TEXT NOT NULL,
    "lesson_number" INTEGER NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "break_minutes" INTEGER,
    "shift" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "BellSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HolidaySchedule" (
    "id" TEXT NOT NULL,
    "title_latin" TEXT NOT NULL,
    "title_cyril" TEXT NOT NULL,
    "title_ru" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "description_latin" TEXT,
    "description_cyril" TEXT,
    "description_ru" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HolidaySchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CanteenMenu" (
    "id" TEXT NOT NULL,
    "day" "WeekDay" NOT NULL,
    "meal_type" "MealType" NOT NULL,
    "menu_latin" TEXT NOT NULL,
    "menu_cyril" TEXT NOT NULL,
    "menu_ru" TEXT NOT NULL,
    "week_start" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CanteenMenu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParentTeacherMeeting" (
    "id" TEXT NOT NULL,
    "title_latin" TEXT NOT NULL,
    "title_cyril" TEXT NOT NULL,
    "title_ru" TEXT NOT NULL,
    "description_latin" TEXT,
    "description_cyril" TEXT,
    "description_ru" TEXT,
    "grade" TEXT,
    "meeting_date" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParentTeacherMeeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdmissionApplication" (
    "id" TEXT NOT NULL,
    "student_full_name" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "grade_applying" TEXT NOT NULL,
    "parent_full_name" TEXT NOT NULL,
    "parent_phone" TEXT NOT NULL,
    "parent_email" TEXT,
    "address" TEXT,
    "previous_school" TEXT,
    "message" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'NEW',
    "admin_comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdmissionApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequiredDocument" (
    "id" TEXT NOT NULL,
    "title_latin" TEXT NOT NULL,
    "title_cyril" TEXT NOT NULL,
    "title_ru" TEXT NOT NULL,
    "description_latin" TEXT,
    "description_cyril" TEXT,
    "description_ru" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "RequiredDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DirectorAppeal" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "answer" TEXT,
    "status" "AppealStatus" NOT NULL DEFAULT 'NEW',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "answered_at" TIMESTAMP(3),

    CONSTRAINT "DirectorAppeal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "News" (
    "id" TEXT NOT NULL,
    "title_latin" TEXT NOT NULL,
    "title_cyril" TEXT NOT NULL,
    "title_ru" TEXT NOT NULL,
    "content_latin" TEXT NOT NULL,
    "content_cyril" TEXT NOT NULL,
    "content_ru" TEXT NOT NULL,
    "cover_image" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "published_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creator_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title_latin" TEXT NOT NULL,
    "title_cyril" TEXT NOT NULL,
    "title_ru" TEXT NOT NULL,
    "description_latin" TEXT,
    "description_cyril" TEXT,
    "description_ru" TEXT,
    "location_latin" TEXT,
    "location_cyril" TEXT,
    "location_ru" TEXT,
    "cover_image" TEXT,
    "type" "EventType" NOT NULL DEFAULT 'SCHOOL_EVENT',
    "event_date" TIMESTAMP(3) NOT NULL,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "creator_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL,
    "title_latin" TEXT NOT NULL,
    "title_cyril" TEXT NOT NULL,
    "title_ru" TEXT NOT NULL,
    "content_latin" TEXT NOT NULL,
    "content_cyril" TEXT NOT NULL,
    "content_ru" TEXT NOT NULL,
    "cover_image" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "published_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creator_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "title_latin" TEXT NOT NULL,
    "title_cyril" TEXT NOT NULL,
    "title_ru" TEXT NOT NULL,
    "category" "DocumentCategory" NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_size" INTEGER,
    "published_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "creator_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaAlbum" (
    "id" TEXT NOT NULL,
    "title_latin" TEXT NOT NULL,
    "title_cyril" TEXT NOT NULL,
    "title_ru" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "cover_image" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "creator_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaAlbum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaItem" (
    "id" TEXT NOT NULL,
    "album_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_size" INTEGER,
    "thumbnail" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Newspaper" (
    "id" TEXT NOT NULL,
    "title_latin" TEXT NOT NULL,
    "title_cyril" TEXT NOT NULL,
    "title_ru" TEXT NOT NULL,
    "issue_number" INTEGER,
    "cover_image" TEXT,
    "file_url" TEXT NOT NULL,
    "file_size" INTEGER,
    "published_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creator_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Newspaper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "slug" "PageSlug" NOT NULL,
    "title_latin" TEXT NOT NULL,
    "title_cyril" TEXT NOT NULL,
    "title_ru" TEXT NOT NULL,
    "content_latin" TEXT NOT NULL,
    "content_cyril" TEXT NOT NULL,
    "content_ru" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Banner" (
    "id" TEXT NOT NULL,
    "title_latin" TEXT,
    "title_cyril" TEXT,
    "title_ru" TEXT,
    "image_url" TEXT NOT NULL,
    "link_url" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsefulLink" (
    "id" TEXT NOT NULL,
    "title_latin" TEXT NOT NULL,
    "title_cyril" TEXT NOT NULL,
    "title_ru" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UsefulLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactInfo" (
    "id" TEXT NOT NULL,
    "address_latin" TEXT NOT NULL,
    "address_cyril" TEXT NOT NULL,
    "address_ru" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "social_links" JSONB,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_number_key" ON "User"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "ClassSchedule_grade_day_idx" ON "ClassSchedule"("grade", "day");

-- CreateIndex
CREATE UNIQUE INDEX "BellSchedule_lesson_number_shift_key" ON "BellSchedule"("lesson_number", "shift");

-- CreateIndex
CREATE INDEX "CanteenMenu_week_start_day_idx" ON "CanteenMenu"("week_start", "day");

-- CreateIndex
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");

-- AddForeignKey
ALTER TABLE "StaffMember" ADD CONSTRAINT "StaffMember_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Club" ADD CONSTRAINT "Club_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaAlbum" ADD CONSTRAINT "MediaAlbum_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaItem" ADD CONSTRAINT "MediaItem_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "MediaAlbum"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Newspaper" ADD CONSTRAINT "Newspaper_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
