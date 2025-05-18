import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { PlatoEntity } from './plato.entity';
import { PlatoService } from './plato.service';
import { PlatoController } from './plato.controller';
import * as sqliteStore from 'cache-manager-sqlite';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlatoEntity]),
    CacheModule.register({
      store: sqliteStore,
      options: {
        ttl: 5,
      },
      path: ':memory:',
    }),
  ],
  controllers: [PlatoController],
  providers: [PlatoService],
  exports: [PlatoService],
})
export class PlatoModule {}
