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
import { PlatoService } from './plato.service';
import { PlatoEntity } from './plato.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';

@Controller('dishes')
@UseInterceptors(BusinessErrorsInterceptor)
export class PlatoController {
  constructor(private readonly platoService: PlatoService) {}

  @Get()
  async findAll(): Promise<PlatoEntity[]> {
    return await this.platoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<PlatoEntity> {
    return await this.platoService.findOne(id);
  }

  @Post()
  async create(@Body() plato: PlatoEntity): Promise<PlatoEntity> {
    return await this.platoService.create(plato);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() plato: PlatoEntity,
  ): Promise<PlatoEntity> {
    return await this.platoService.update(id, plato);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: number) {
    await this.platoService.delete(id);
  }
}
