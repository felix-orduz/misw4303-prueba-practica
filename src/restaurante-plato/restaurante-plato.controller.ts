/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  UseInterceptors,
} from '@nestjs/common';
import { RestaurantePlatoService } from './restaurante-plato.service';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { PlatoEntity } from '../plato/plato.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';

@Controller('restaurants')
@UseInterceptors(BusinessErrorsInterceptor)
export class RestaurantePlatoController {
  constructor(private readonly restaurantePlatoService: RestaurantePlatoService) {}

  @Post(':restauranteId/dishes/:platoId')
  async addDishToRestaurant(
    @Param('restauranteId') restauranteId: string,
    @Param('platoId') platoId: number,
  ): Promise<RestauranteEntity> {
    return await this.restaurantePlatoService.addDishToRestaurant(restauranteId, platoId);
  }

  @Get(':restauranteId/dishes')
  async findDishesFromRestaurant(
    @Param('restauranteId') restauranteId: string,
  ): Promise<PlatoEntity[]> {
    return await this.restaurantePlatoService.findDishesFromRestaurant(restauranteId);
  }

  @Get(':restauranteId/dishes/:platoId')
  async findDishFromRestaurant(
    @Param('restauranteId') restauranteId: string,
    @Param('platoId') platoId: number,
  ): Promise<PlatoEntity> {
    return await this.restaurantePlatoService.findDishFromRestaurant(restauranteId, platoId);
  }

  @Put(':restauranteId/dishes')
  async updateDishesFromRestaurant(
    @Param('restauranteId') restauranteId: string,
    @Body() platos: PlatoEntity[],
  ): Promise<RestauranteEntity> {
    return await this.restaurantePlatoService.updateDishesFromRestaurant(restauranteId, platos);
  }

  @Delete(':restauranteId/dishes/:platoId')
  @HttpCode(204)
  async deleteDishFromRestaurant(
    @Param('restauranteId') restauranteId: string,
    @Param('platoId') platoId: number,
  ) {
    await this.restaurantePlatoService.deleteDishFromRestaurant(restauranteId, platoId);
  }
}
