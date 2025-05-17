/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { RestauranteEntity, TipoCocina } from './restaurante.entity';

@Injectable()
export class RestauranteService {


  constructor(
    @InjectRepository(RestauranteEntity)
    private readonly restauranteRepository: Repository<RestauranteEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findAll(): Promise<RestauranteEntity[]> {
    const cached: RestauranteEntity[] = await this.cacheManager.get<RestauranteEntity[]>('restaurantes');
    if (!cached) {
      const restaurantes: RestauranteEntity[] = await this.restauranteRepository.find({
        relations: ['platos'],
      });
      await this.cacheManager.set('restaurantes', restaurantes);
      return restaurantes;
    }
    return cached;
  }

  async findOne(id: string): Promise<RestauranteEntity> {
    const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({
      where: { idRestaurante: id },
      relations: ['platos'],
    });
    if (!restaurante)
      throw new BusinessLogicException(
        'El restaurante con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    return restaurante;
  }

  async create(restaurante: RestauranteEntity): Promise<RestauranteEntity> {
    if (!Object.values(TipoCocina).includes(restaurante.tipoCocina)) {
      throw new BusinessLogicException(
        'El tipo de cocina debe ser uno de los siguientes: Italiana, Japonesa, Mexicana, Colombiana, India, Internacional',
        BusinessError.BAD_REQUEST,
      );
    }
    const newRestaurante = this.restauranteRepository.create(restaurante);
    return await this.restauranteRepository.save(newRestaurante);
  }

  async update(id: string, restaurante: RestauranteEntity): Promise<RestauranteEntity> {
    const persistedRestaurante: RestauranteEntity = await this.restauranteRepository.findOne({
      where: { idRestaurante: id },
    });
    if (!persistedRestaurante)
      throw new BusinessLogicException(
        'El restaurante con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    if (!Object.values(TipoCocina).includes(restaurante.tipoCocina)) {
      throw new BusinessLogicException(
        'El tipo de cocina debe ser uno de los siguientes: Italiana, Japonesa, Mexicana, Colombiana, India, Internacional',
        BusinessError.BAD_REQUEST,
      );
    }

    return await this.restauranteRepository.save({
      ...persistedRestaurante,
      ...restaurante,
    });
  }

  async delete(id: string) {
    const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({
      where: { idRestaurante: id },
    });
    if (!restaurante)
      throw new BusinessLogicException(
        'El restaurante con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    await this.restauranteRepository.remove(restaurante);
  }
}
