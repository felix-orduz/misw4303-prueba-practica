/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { PlatoEntity } from '../plato/plato.entity';

@Injectable()
export class RestaurantePlatoService {
  constructor(
    @InjectRepository(RestauranteEntity)
    private readonly restauranteRepository: Repository<RestauranteEntity>,
    @InjectRepository(PlatoEntity)
    private readonly platoRepository: Repository<PlatoEntity>,
  ) {}

  async addDishToRestaurant(
    restauranteId: string,
    platoId: number,
  ): Promise<RestauranteEntity> {
    const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({
      where: { idRestaurante: restauranteId },
      relations: ['platos'],
    });
    if (!restaurante)
      throw new BusinessLogicException(
        'El restaurante con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    const plato: PlatoEntity = await this.platoRepository.findOne({
      where: { id: platoId },
    });
    if (!plato)
      throw new BusinessLogicException(
        'El plato con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    restaurante.platos = [...restaurante.platos, plato];
    return await this.restauranteRepository.save(restaurante);
  }

  async findDishesFromRestaurant(
    restauranteId: string,
  ): Promise<PlatoEntity[]> {
    const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({
      where: { idRestaurante: restauranteId },
      relations: ['platos'],
    });
    if (!restaurante)
      throw new BusinessLogicException(
        'El restaurante con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    return restaurante.platos;
  }

  async findDishFromRestaurant(
    restauranteId: string,
    platoId: number,
  ): Promise<PlatoEntity> {
    const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({
      where: { idRestaurante: restauranteId },
      relations: ['platos'],
    });
    if (!restaurante)
      throw new BusinessLogicException(
        'El restaurante con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    const plato: PlatoEntity = restaurante.platos.find(
      (p) => p.id === platoId,
    );
    if (!plato)
      throw new BusinessLogicException(
        'El plato no está asociado al restaurante',
        BusinessError.NOT_FOUND,
      );

    return plato;
  }

  async updateDishesFromRestaurant(
    restauranteId: string,
    platos: PlatoEntity[],
  ): Promise<RestauranteEntity> {
    const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({
      where: { idRestaurante: restauranteId },
      relations: ['platos'],
    });
    if (!restaurante)
      throw new BusinessLogicException(
        'El restaurante con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    // Validate that all platos exist
    for (const plato of platos) {
      const platoExists = await this.platoRepository.findOne({
        where: { id: plato.id },
      });
      if (!platoExists)
        throw new BusinessLogicException(
          `El plato con id ${plato.id} no fue encontrado`,
          BusinessError.NOT_FOUND,
        );
    }

    restaurante.platos = platos;
    return await this.restauranteRepository.save(restaurante);
  }

  async deleteDishFromRestaurant(
    restauranteId: string,
    platoId: number,
  ): Promise<RestauranteEntity> {
    const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({
      where: { idRestaurante: restauranteId },
      relations: ['platos'],
    });
    if (!restaurante)
      throw new BusinessLogicException(
        'El restaurante con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    const plato: PlatoEntity = restaurante.platos.find(
      (p) => p.id === platoId,
    );
    if (!plato)
      throw new BusinessLogicException(
        'El plato no está asociado al restaurante',
        BusinessError.NOT_FOUND,
      );

    restaurante.platos = restaurante.platos.filter((p) => p.id !== platoId);
    return await this.restauranteRepository.save(restaurante);
  }
}
