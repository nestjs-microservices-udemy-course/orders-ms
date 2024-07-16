import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { OrdersModule } from './orders/orders.module';
import { NatsModule } from './transports/nats.module';
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
    OrdersModule,
    NatsModule,
  ],
})
export class AppModule {}
