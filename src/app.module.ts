import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { prettyTarget } from './utils/pretty.target';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        autoLogging: true,
        customAttributeKeys: {
          req: 'request',
          res: 'response',
          err: 'error',
        },
        transport: { target: prettyTarget },
      },
    }),
  ],
})
export class AppModule {}
