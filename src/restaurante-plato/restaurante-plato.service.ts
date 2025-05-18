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

  async addPlatoRestaurante(
    restauranteId: string,
    platoId: string,
  ): Promise<RestauranteEntity> {
    const plato: PlatoEntity = await this.platoRepository.findOne({
      where: { idPlato: platoId },
    });
    if (!plato)
      throw new BusinessLogicException(
        'El plato con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({
      where: { idRestaurante: restauranteId },
      relations: ['platos'],
    });
    if (!restaurante)
      throw new BusinessLogicException(
        'El restaurante con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    restaurante.platos = [...restaurante.platos, plato];
    return await this.restauranteRepository.save(restaurante);
  }

  async findPlatoByRestauranteIdPlatoId(
    restauranteId: string,
    platoId: string,
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

    const persistedPlato: PlatoEntity = restaurante.platos.find(
      (p) => p.idPlato === platoId,
    );

    if (!persistedPlato)
      throw new BusinessLogicException(
        'El plato con el id dado no fue encontrado en el restaurante',
        BusinessError.PRECONDITION_FAILED,
      );

    return persistedPlato;
  }

  async findPlatosByRestauranteId(restauranteId: string): Promise<PlatoEntity[]> {
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

  async associatePlatosRestaurante(
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

    for (let i = 0; i < platos.length; i++) {
      const plato: PlatoEntity = await this.platoRepository.findOne({
        where: { idPlato: platos[i].idPlato },
      });
      if (!plato)
        throw new BusinessLogicException(
          `El plato con id ${platos[i].idPlato} no fue encontrado`,
          BusinessError.NOT_FOUND,
        );
    }

    restaurante.platos = platos;
    return await this.restauranteRepository.save(restaurante);
  }

  async deletePlatoRestaurante(restauranteId: string, platoId: string) {
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
      where: { idPlato: platoId },
    });
    if (!plato)
      throw new BusinessLogicException(
        'El plato con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    const restaurantePlato: PlatoEntity = restaurante.platos.find(
      (p) => p.idPlato === platoId,
    );

    if (!restaurantePlato)
      throw new BusinessLogicException(
        'El plato con el id dado no está asociado al restaurante',
        BusinessError.PRECONDITION_FAILED,
      );

    restaurante.platos = restaurante.platos.filter((p) => p.idPlato !== platoId);
    await this.restauranteRepository.save(restaurante);
  }
}
