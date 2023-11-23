import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@vendia/serverless-express';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { Callback, Context, Handler } from 'aws-lambda';
import * as dotenv from 'dotenv';

// async function bootstrap(): Promise<Handler> {
//   console.log(process.env);

//   const app = await NestFactory.create(AppModule);
//   app.enableCors({
//     origin: 'https://d16pd4ocp5ok6l.cloudfront.net',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true,
//   });
//   await app.init();

//   app.use(helmet());
//   const expressApp = app.getHttpAdapter().getInstance();

//   return serverlessExpress({ app: expressApp });
// }

// export const handler: Handler = async (
//   event: any,
//   context: Context,
//   callback: Callback,
// ) => {
//   server = server ?? (await bootstrap());
//   return server(event, context, callback);
// };

const port = process.env.PORT || 3000;

async function bootstrap() {
  dotenv.config();
  console.log(process.env);

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (req, callback) => callback(null, true),
  });
  app.use(helmet());
  await app.listen(port);
}
bootstrap().then(() => {
  console.log('App is running on %s port', port);
});
