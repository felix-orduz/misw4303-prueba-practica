import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RestaurantePlatoService } from './restaurante-plato.service';
import { RestauranteEntity, TipoCocina } from '../restaurante/restaurante.entity';
import { PlatoEntity, CategoriaPlato } from '../plato/plato.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

describe('RestaurantePlatoService', () => {
  let service: RestaurantePlatoService;
  let restauranteRepository: Repository<RestauranteEntity>;
  let platoRepository: Repository<PlatoEntity>;

  const mockRestaurante = {
    idRestaurante: '1',
    nombre: 'Test Restaurant',
    tipoCocina: TipoCocina.ITALIANA,
    direccion: 'Test Address',
    platos: [],
  };

  const mockPlato = {
    id: 1,
    nombre: 'Test Dish',
    descripcion: 'Test Description',
    precio: 10.99,
    categoria: CategoriaPlato.PLATO_FUERTE,
    restaurantes: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantePlatoService,
        {
          provide: getRepositoryToken(RestauranteEntity),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(PlatoEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RestaurantePlatoService>(RestaurantePlatoService);
    restauranteRepository = module.get<Repository<RestauranteEntity>>(
      getRepositoryToken(RestauranteEntity),
    );
    platoRepository = module.get<Repository<PlatoEntity>>(
      getRepositoryToken(PlatoEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addDishToRestaurant', () => {
    it('should add a dish to a restaurant', async () => {
      jest.spyOn(restauranteRepository, 'findOne').mockResolvedValue(mockRestaurante);
      jest.spyOn(platoRepository, 'findOne').mockResolvedValue(mockPlato);
      jest.spyOn(restauranteRepository, 'save').mockResolvedValue({
        ...mockRestaurante,
        platos: [mockPlato],
      });

      const result = await service.addDishToRestaurant('1', 1);
      expect(result.platos).toContainEqual(mockPlato);
    });

    it('should throw BusinessLogicException when restaurant does not exist', async () => {
      jest.spyOn(restauranteRepository, 'findOne').mockResolvedValue(null);

      await expect(service.addDishToRestaurant('1', 1)).rejects.toThrow(
        BusinessLogicException,
      );
    });

    it('should throw BusinessLogicException when dish does not exist', async () => {
      jest.spyOn(restauranteRepository, 'findOne').mockResolvedValue(mockRestaurante);
      jest.spyOn(platoRepository, 'findOne').mockResolvedValue(null);

      await expect(service.addDishToRestaurant('1', 1)).rejects.toThrow(
        BusinessLogicException,
      );
    });
  });

  describe('findDishesFromRestaurant', () => {
    it('should return dishes from a restaurant', async () => {
      const restauranteWithPlatos = {
        ...mockRestaurante,
        platos: [mockPlato],
      };
      jest.spyOn(restauranteRepository, 'findOne').mockResolvedValue(restauranteWithPlatos);

      const result = await service.findDishesFromRestaurant('1');
      expect(result).toEqual([mockPlato]);
    });

    it('should throw BusinessLogicException when restaurant does not exist', async () => {
      jest.spyOn(restauranteRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findDishesFromRestaurant('1')).rejects.toThrow(
        BusinessLogicException,
      );
    });
  });

  describe('findDishFromRestaurant', () => {
    it('should return a dish from a restaurant', async () => {
      const restauranteWithPlatos = {
        ...mockRestaurante,
        platos: [mockPlato],
      };
      jest.spyOn(restauranteRepository, 'findOne').mockResolvedValue(restauranteWithPlatos);

      const result = await service.findDishFromRestaurant('1', 1);
      expect(result).toEqual(mockPlato);
    });

    it('should throw BusinessLogicException when restaurant does not exist', async () => {
      jest.spyOn(restauranteRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findDishFromRestaurant('1', 1)).rejects.toThrow(
        BusinessLogicException,
      );
    });

    it('should throw BusinessLogicException when dish is not in restaurant', async () => {
      jest.spyOn(restauranteRepository, 'findOne').mockResolvedValue(mockRestaurante);

      await expect(service.findDishFromRestaurant('1', 1)).rejects.toThrow(
        BusinessLogicException,
      );
    });
  });

  describe('updateDishesFromRestaurant', () => {
    it('should update dishes from a restaurant', async () => {
      jest.spyOn(restauranteRepository, 'findOne').mockResolvedValue(mockRestaurante);
      jest.spyOn(platoRepository, 'findOne').mockResolvedValue(mockPlato);
      jest.spyOn(restauranteRepository, 'save').mockResolvedValue({
        ...mockRestaurante,
        platos: [mockPlato],
      });

      const result = await service.updateDishesFromRestaurant('1', [mockPlato]);
      expect(result.platos).toEqual([mockPlato]);
    });

    it('should throw BusinessLogicException when restaurant does not exist', async () => {
      jest.spyOn(restauranteRepository, 'findOne').mockResolvedValue(null);

      await expect(service.updateDishesFromRestaurant('1', [mockPlato])).rejects.toThrow(
        BusinessLogicException,
      );
    });

    it('should throw BusinessLogicException when a dish does not exist', async () => {
      jest.spyOn(restauranteRepository, 'findOne').mockResolvedValue(mockRestaurante);
      jest.spyOn(platoRepository, 'findOne').mockResolvedValue(null);

      await expect(service.updateDishesFromRestaurant('1', [mockPlato])).rejects.toThrow(
        BusinessLogicException,
      );
    });
  });

  describe('deleteDishFromRestaurant', () => {
    it('should delete a dish from a restaurant', async () => {
      const restauranteWithPlatos = {
        ...mockRestaurante,
        platos: [mockPlato],
      };
      jest.spyOn(restauranteRepository, 'findOne').mockResolvedValue(restauranteWithPlatos);
      jest.spyOn(restauranteRepository, 'save').mockResolvedValue({
        ...mockRestaurante,
        platos: [],
      });

      const result = await service.deleteDishFromRestaurant('1', 1);
      expect(result.platos).toEqual([]);
    });

    it('should throw BusinessLogicException when restaurant does not exist', async () => {
      jest.spyOn(restauranteRepository, 'findOne').mockResolvedValue(null);

      await expect(service.deleteDishFromRestaurant('1', 1)).rejects.toThrow(
        BusinessLogicException,
      );
    });

    it('should throw BusinessLogicException when dish is not in restaurant', async () => {
      jest.spyOn(restauranteRepository, 'findOne').mockResolvedValue(mockRestaurante);

      await expect(service.deleteDishFromRestaurant('1', 1)).rejects.toThrow(
        BusinessLogicException,
      );
    });
  });
});
