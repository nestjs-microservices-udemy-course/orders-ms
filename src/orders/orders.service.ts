import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, PrismaClient } from '@prisma/client';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { RpcException } from '@nestjs/microservices';
import { OrderPaginationDto } from 'src/common/dto';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  constructor(
    @InjectPinoLogger(OrdersService.name)
    private readonly logger: PinoLogger,
  ) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.info('Connected to the database');
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    return this.order.create({
      data: createOrderDto,
    });
  }

  async findAll(orderPaginationDto: OrderPaginationDto) {
    const { status, page, limit } = orderPaginationDto;

    const totalPages = await this.order.count({
      where: {
        status,
      },
    });

    const orders = await this.order.findMany({
      where: {
        status,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: orders,
      meta: {
        total: totalPages,
        page,
        lastPage: Math.ceil(totalPages / limit),
      },
    };
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.order.findUnique({
      where: {
        id,
      },
    });

    if (!order) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'order_not_found',
      });
    }

    return order;
  }
}
