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
  ParseUUIDPipe,
} from '@nestjs/common';
import { RestauranteService } from './restaurante.service';
import { RestauranteEntity } from './restaurante.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';

@Controller('restaurants')
@UseInterceptors(BusinessErrorsInterceptor)
export class RestauranteController {
  constructor(private readonly restauranteService: RestauranteService) {}

  @Get()
  async findAll(): Promise<RestauranteEntity[]> {
    return await this.restauranteService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<RestauranteEntity> {
    return await this.restauranteService.findOne(id);
  }

  @Post()
  async create(@Body() restaurante: RestauranteEntity): Promise<RestauranteEntity> {
    return await this.restauranteService.create(restaurante);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() restaurante: RestauranteEntity,
  ): Promise<RestauranteEntity> {
    return await this.restauranteService.update(id, restaurante);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.restauranteService.delete(id);
  }
}
