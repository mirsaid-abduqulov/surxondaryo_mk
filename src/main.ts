import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const config = app.get(ConfigService);
  const port = config.get<number>('API_PORT', 3001);
  const nodeEnv = config.get<string>('NODE_ENV', 'development');
  const isProd = nodeEnv === 'production';

  const allowedOrigins = config
    .get<string>('ALLOWED_ORIGINS', '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  const corsLogger = new Logger('CORS');
  const httpLogger = new Logger('HTTP');
  const appLogger = new Logger('Bootstrap');

  appLogger.log(`Allowed origins: ${JSON.stringify(allowedOrigins)}`);

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (!isProd && allowedOrigins.length === 0) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        corsLogger.warn(`Blocked origin: ${origin}`);
        callback(new Error(`CORS policy: origin '${origin}' is not allowed`));
      }
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-device-id'],
    maxAge: 86400,
  });

  app.use(cookieParser());
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      const color =
        res.statusCode >= 500
          ? '\x1b[31m'
          : res.statusCode >= 400
            ? '\x1b[33m'
            : res.statusCode >= 300
              ? '\x1b[36m'
              : '\x1b[32m';
      httpLogger.log(
        `${color}${req.method}\x1b[0m ${req.originalUrl} → ${res.statusCode} (${duration}ms)`,
      );
    });
    next();
  });

  app.useStaticAssets(join(process.cwd(), 'media'), { prefix: '/media/' });

  if (!isProd) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Surxondaryo Maktabi sayti API')
      .setDescription('Backend API hujjati')
      .setVersion('1.0')
      .addServer(`http://localhost:${port}`, 'Local')
      .addServer(`http://${config.get<string>('API_HOST')}:${port}`, 'Server')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'none',
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
      customCss: `
      /* Authorize tugmasi turgan panelni yuqorida qotirish */
      .swagger-ui .scheme-container {
        position: sticky !important;
        top: 0 !important;
        z-index: 1000 !important;
        background-color: #fafafa !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12) !important;
        padding: 12px 0 !important;
      }
    `,
    });
    appLogger.log(`Swagger: http://localhost:${port}/api/docs`);
  }

  app.enableShutdownHooks();

  await app.listen(port);
  appLogger.log(`Chinoz Kutubxona Markazi API [${nodeEnv}] started on http://localhost:${port}/api`);
}

bootstrap().catch((err: unknown) => {
  const logger = new Logger('Bootstrap');
  logger.error('Failed to start application', err);
  process.exit(1);
});