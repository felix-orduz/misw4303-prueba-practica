import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestauranteModule } from './restaurante/restaurante.module';
import { PlatoModule } from './plato/plato.module';
import { RestaurantePlatoModule } from './restaurante-plato/restaurante-plato.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestauranteEntity } from './restaurante/restaurante.entity';
import { PlatoEntity } from './plato/plato.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '102261',
      database: 'restaurante',
      entities: [
        RestauranteEntity,
        PlatoEntity,
      ],
      dropSchema: false,
      synchronize: true,
    }),
    RestauranteModule,
    PlatoModule,
    RestaurantePlatoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
