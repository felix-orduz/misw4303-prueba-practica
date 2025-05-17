/* eslint-disable prettier/prettier */
import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { PlatoEntity, CategoriaPlato } from './plato.entity';

@Injectable()
export class PlatoService {
  constructor(
    @InjectRepository(PlatoEntity)
    private readonly platoRepository: Repository<PlatoEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findAll(): Promise<PlatoEntity[]> {
    const cached: PlatoEntity[] = await this.cacheManager.get<PlatoEntity[]>('platos');
    if (!cached) {
      const platos: PlatoEntity[] = await this.platoRepository.find({
        relations: ['restaurantes'],
      });
      await this.cacheManager.set('platos', platos);
      return platos;
    }
    return cached;
  }

  async findOne(id: number): Promise<PlatoEntity> {
    const plato: PlatoEntity = await this.platoRepository.findOne({
      where: { id },
      relations: ['restaurantes'],
    });
    if (!plato)
      throw new BusinessLogicException(
        'El plato con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    return plato;
  }

  async create(plato: PlatoEntity): Promise<PlatoEntity> {
    if (plato.precio <= 0) {
      throw new BusinessLogicException(
        'El precio debe ser un número positivo',
        BusinessError.BAD_REQUEST,
      );
    }

    if (!Object.values(CategoriaPlato).includes(plato.categoria)) {
      throw new BusinessLogicException(
        'La categoría debe ser una de las siguientes: entrada, plato_fuerte, postre, bebida',
        BusinessError.BAD_REQUEST,
      );
    }

    return await this.platoRepository.save(plato);
  }

  async update(id: number, plato: PlatoEntity): Promise<PlatoEntity> {
    const persistedPlato: PlatoEntity = await this.platoRepository.findOne({
      where: { id },
    });
    if (!persistedPlato)
      throw new BusinessLogicException(
        'El plato con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    if (plato.precio <= 0) {
      throw new BusinessLogicException(
        'El precio debe ser un número positivo',
        BusinessError.BAD_REQUEST,
      );
    }

    if (!Object.values(CategoriaPlato).includes(plato.categoria)) {
      throw new BusinessLogicException(
        'La categoría debe ser una de las siguientes: entrada, plato_fuerte, postre, bebida',
        BusinessError.BAD_REQUEST,
      );
    }

    return await this.platoRepository.save({
      ...persistedPlato,
      ...plato,
    });
  }

  async delete(id: number) {
    const plato: PlatoEntity = await this.platoRepository.findOne({
      where: { id },
    });
    if (!plato)
      throw new BusinessLogicException(
        'El plato con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    await this.platoRepository.remove(plato);
  }
}
