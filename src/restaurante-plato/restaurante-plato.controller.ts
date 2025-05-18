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
  UseInterceptors,
} from '@nestjs/common';
import { RestaurantePlatoService } from './restaurante-plato.service';
import { PlatoEntity } from '../plato/plato.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';

@Controller('restaurants')
@UseInterceptors(BusinessErrorsInterceptor)
export class RestaurantePlatoController {
  constructor(private readonly restaurantePlatoService: RestaurantePlatoService) {}

  @Post(':restauranteId/dishes/:platoId')
  async addPlatoRestaurante(
    @Param('restauranteId') restauranteId: string,
    @Param('platoId') platoId: string,
  ) {
    return await this.restaurantePlatoService.addPlatoRestaurante(restauranteId, platoId);
  }

  @Get(':restauranteId/dishes')
  async findPlatosByRestauranteId(@Param('restauranteId') restauranteId: string) {
    return await this.restaurantePlatoService.findPlatosByRestauranteId(restauranteId);
  }

  @Get(':restauranteId/dishes/:platoId')
  async findPlatoByRestauranteIdPlatoId(
    @Param('restauranteId') restauranteId: string,
    @Param('platoId') platoId: string,
  ) {
    return await this.restaurantePlatoService.findPlatoByRestauranteIdPlatoId(restauranteId, platoId);
  }

  @Put(':restauranteId/dishes')
  async associatePlatosRestaurante(
    @Param('restauranteId') restauranteId: string,
    @Body() platos: { platos: string[] },
  ) {
    return await this.restaurantePlatoService.associatePlatosRestaurante(restauranteId, platos.platos);
  }

  @Delete(':restauranteId/dishes/:platoId')
  @HttpCode(204)
  async deletePlatoRestaurante(
    @Param('restauranteId') restauranteId: string,
    @Param('platoId') platoId: string,
  ) {
    await this.restaurantePlatoService.deletePlatoRestaurante(restauranteId, platoId);
  }
}
