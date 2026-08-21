import { Injectable, Logger } from '@nestjs/common';
import { join } from 'path';
import { createWriteStream, unlink } from 'fs';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';

const unlinkAsync = promisify(unlink);

export type StorageFolder =
  | 'announcements'
  | 'banners'
  | 'news'
  | 'events'
  | 'documents'
  | 'media_albums'
  | 'media_items'
  | 'social_icons'
  | 'staff_photos'
  | 'clubs'
  | 'newspapers'
  | 'canteen-menu'
  | 'media_presentations';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly mediaBasePath = join(process.cwd(), 'media');

  constructor() {
    this.ensureDirectories();
  }

  private ensureDirectories() {
    const folders: StorageFolder[] = [
      'announcements',
      'banners',
      'news',
      'events',
      'documents',
      'media_albums',
      'media_items',
      'social_icons',
      'staff_photos',
      'clubs',
      'newspapers',
      'canteen-menu',
      'media_presentations'
    ];
    for (const folder of folders) {
      const path = join(this.mediaBasePath, folder);
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
      }
    }
  }

  async saveFile(
    file: Express.Multer.File,
    folder: StorageFolder,
  ): Promise<{ url: string; fileName: string; fileSize: number }> {
    return new Promise((resolve, reject) => {
      const ext = file.originalname.split('.').pop() || '';
      const uniqueName = `${uuidv4()}.${ext}`;
      const filePath = join(this.mediaBasePath, folder, uniqueName);

      const writeStream = createWriteStream(filePath);

      writeStream.on('finish', () => {
        resolve({
          url: `/media/${folder}/${uniqueName}`,
          fileName: file.originalname,
          fileSize: file.size,
        });
      });

      writeStream.on('error', (err) => {
        this.logger.error(`Failed to save file: ${err.message}`, err.stack);
        reject(err);
      });

      // Write buffer to stream (since multer memoryStorage provides buffer)
      writeStream.end(file.buffer);
    });
  }

  async deleteFile(url: string | null): Promise<void> {
    if (!url) return;

    try {
      // URL format is /media/folder/filename
      const relativePath = url.replace('/media/', '');
      const fullPath = join(this.mediaBasePath, relativePath);

      if (fs.existsSync(fullPath)) {
        await unlinkAsync(fullPath);
        this.logger.log(`Deleted file: ${fullPath}`);
      }
    } catch (error) {
      this.logger.warn(`Failed to delete file at ${url}: ${error.message}`);
    }
  }

  async replaceFile(
    oldUrl: string | null,
    newFile: Express.Multer.File,
    folder: StorageFolder,
  ): Promise<{ url: string; fileName: string; fileSize: number }> {
    const newFileInfo = await this.saveFile(newFile, folder);

    if (oldUrl) {
      await this.deleteFile(oldUrl);
    }

    return newFileInfo;
  }
}
