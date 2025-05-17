/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestauranteEntity } from '../../restaurante/restaurante.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [
      RestauranteEntity,

    ],
    synchronize: true,
  }),
  TypeOrmModule.forFeature([
    RestauranteEntity,
  ]),
];
