import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Repository } from 'typeorm';
import { RestauranteService } from './restaurante.service';
import { RestauranteEntity, TipoCocina } from './restaurante.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

describe('RestauranteService', () => {
  let service: RestauranteService;
  let repository: Repository<RestauranteEntity>;
  let cacheManager: any;

  const mockRestaurante = {
    idRestaurante: '1',
    nombre: 'Test Restaurant',
    tipoCocina: TipoCocina.ITALIANA,
    direccion: 'Test Address',
    platos: [],
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestauranteService,
        {
          provide: getRepositoryToken(RestauranteEntity),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<RestauranteService>(RestauranteService);
    repository = module.get<Repository<RestauranteEntity>>(
      getRepositoryToken(RestauranteEntity),
    );
    cacheManager = module.get(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return cached restaurants when available', async () => {
      const cachedRestaurants = [mockRestaurante];
      mockCacheManager.get.mockResolvedValue(cachedRestaurants);

      const result = await service.findAll();
      expect(result).toEqual(cachedRestaurants);
      expect(repository.find).not.toHaveBeenCalled();
    });

    it('should fetch and cache restaurants when cache is empty', async () => {
      const restaurants = [mockRestaurante];
      mockCacheManager.get.mockResolvedValue(null);
      jest.spyOn(repository, 'find').mockResolvedValue(restaurants);

      const result = await service.findAll();
      expect(result).toEqual(restaurants);
      expect(repository.find).toHaveBeenCalledWith({ relations: ['platos'] });
      expect(mockCacheManager.set).toHaveBeenCalledWith('restaurantes', restaurants);
    });
  });

  describe('findOne', () => {
    it('should return a restaurant when it exists', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockRestaurante);

      const result = await service.findOne('1');
      expect(result).toEqual(mockRestaurante);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { idRestaurante: '1' },
        relations: ['platos'],
      });
    });

    it('should throw BusinessLogicException when restaurant does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(BusinessLogicException);
    });
  });

  describe('create', () => {
    it('should create a restaurant with valid data', async () => {
      jest.spyOn(repository, 'save').mockResolvedValue(mockRestaurante);

      const result = await service.create(mockRestaurante);
      expect(result).toEqual(mockRestaurante);
      expect(repository.save).toHaveBeenCalledWith(mockRestaurante);
    });

    it('should throw BusinessLogicException when tipoCocina is invalid', async () => {
      const invalidRestaurante = {
        ...mockRestaurante,
        tipoCocina: 'invalid' as TipoCocina,
      };

      await expect(service.create(invalidRestaurante)).rejects.toThrow(
        BusinessLogicException,
      );
    });
  });

  describe('update', () => {
    it('should update a restaurant when it exists', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockRestaurante);
      jest.spyOn(repository, 'save').mockResolvedValue({
        ...mockRestaurante,
        nombre: 'Updated Name',
      });

      const result = await service.update('1', {
        ...mockRestaurante,
        nombre: 'Updated Name',
      });
      expect(result.nombre).toBe('Updated Name');
    });

    it('should throw BusinessLogicException when restaurant does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.update('1', mockRestaurante)).rejects.toThrow(
        BusinessLogicException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a restaurant when it exists', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockRestaurante);
      jest.spyOn(repository, 'remove').mockResolvedValue(mockRestaurante);

      await service.delete('1');
      expect(repository.remove).toHaveBeenCalledWith(mockRestaurante);
    });

    it('should throw BusinessLogicException when restaurant does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.delete('1')).rejects.toThrow(BusinessLogicException);
    });
  });
});
