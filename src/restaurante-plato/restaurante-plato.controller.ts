/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
} from '@nestjs/common';
import { RestaurantePlatoService } from './restaurante-plato.service';
import { PlatoEntity } from '../plato/plato.entity';

@Controller('restaurantes')
export class RestaurantePlatoController {
  constructor(private readonly restaurantePlatoService: RestaurantePlatoService) {}

  @Post(':restauranteId/platos/:platoId')
  async addPlatoRestaurante(
    @Param('restauranteId') restauranteId: string,
    @Param('platoId') platoId: string,
  ) {
    return await this.restaurantePlatoService.addPlatoRestaurante(restauranteId, platoId);
  }

  @Get(':restauranteId/platos')
  async findPlatosByRestauranteId(@Param('restauranteId') restauranteId: string) {
    return await this.restaurantePlatoService.findPlatosByRestauranteId(restauranteId);
  }

  @Get(':restauranteId/platos/:platoId')
  async findPlatoByRestauranteIdPlatoId(
    @Param('restauranteId') restauranteId: string,
    @Param('platoId') platoId: string,
  ) {
    return await this.restaurantePlatoService.findPlatoByRestauranteIdPlatoId(restauranteId, platoId);
  }

  @Put(':restauranteId/platos')
  async associatePlatosRestaurante(
    @Param('restauranteId') restauranteId: string,
    @Body() platos: PlatoEntity[],
  ) {
    return await this.restaurantePlatoService.associatePlatosRestaurante(restauranteId, platos);
  }

  @Delete(':restauranteId/platos/:platoId')
  @HttpCode(204)
  async deletePlatoRestaurante(
    @Param('restauranteId') restauranteId: string,
    @Param('platoId') platoId: string,
  ) {
    await this.restaurantePlatoService.deletePlatoRestaurante(restauranteId, platoId);
  }
}
