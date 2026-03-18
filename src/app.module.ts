import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RoomsModule } from './rooms/rooms.module';
import { BookingsModule } from './bookings/bookings.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { AdminModule } from './admin/admin.module'; // <-- add this

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres', // changed from 'mysql'
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
      password: configService.get('DB_PASSWORD'),
database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // auto-create tables (dev only)
        extra: {
          ssl: {
            rejectUnauthorized: false, // required for CockroachDB
          },
        },
      }),
    }),
    AuthModule,
    UsersModule,
    RoomsModule,
    BookingsModule,
    RestaurantModule,
    AdminModule,
  ],
})
export class AppModule {}