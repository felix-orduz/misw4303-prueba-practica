import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Repository } from 'typeorm';
import { PlatoService } from './plato.service';
import { PlatoEntity, CategoriaPlato } from './plato.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

describe('PlatoService', () => {
  let service: PlatoService;
  let repository: Repository<PlatoEntity>;
  let cacheManager: any;

  const mockPlato = {
    id: 1,
    nombre: 'Test Dish',
    descripcion: 'Test Description',
    precio: 10.99,
    categoria: CategoriaPlato.PLATO_FUERTE,
    restaurantes: [],
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlatoService,
        {
          provide: getRepositoryToken(PlatoEntity),
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

    service = module.get<PlatoService>(PlatoService);
    repository = module.get<Repository<PlatoEntity>>(
      getRepositoryToken(PlatoEntity),
    );
    cacheManager = module.get(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return cached dishes when available', async () => {
      const cachedDishes = [mockPlato];
      mockCacheManager.get.mockResolvedValue(cachedDishes);

      const result = await service.findAll();
      expect(result).toEqual(cachedDishes);
      expect(repository.find).not.toHaveBeenCalled();
    });

    it('should fetch and cache dishes when cache is empty', async () => {
      const dishes = [mockPlato];
      mockCacheManager.get.mockResolvedValue(null);
      jest.spyOn(repository, 'find').mockResolvedValue(dishes);

      const result = await service.findAll();
      expect(result).toEqual(dishes);
      expect(repository.find).toHaveBeenCalledWith({ relations: ['restaurantes'] });
      expect(mockCacheManager.set).toHaveBeenCalledWith('platos', dishes);
    });
  });

  describe('findOne', () => {
    it('should return a dish when it exists', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockPlato);

      const result = await service.findOne(1);
      expect(result).toEqual(mockPlato);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['restaurantes'],
      });
    });

    it('should throw BusinessLogicException when dish does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(BusinessLogicException);
    });
  });

  describe('create', () => {
    it('should create a dish with valid data', async () => {
      jest.spyOn(repository, 'save').mockResolvedValue(mockPlato);

      const result = await service.create(mockPlato);
      expect(result).toEqual(mockPlato);
      expect(repository.save).toHaveBeenCalledWith(mockPlato);
    });

    it('should throw BusinessLogicException when price is negative', async () => {
      const invalidPlato = {
        ...mockPlato,
        precio: -10.99,
      };

      await expect(service.create(invalidPlato)).rejects.toThrow(BusinessLogicException);
    });

    it('should throw BusinessLogicException when categoria is invalid', async () => {
      const invalidPlato = {
        ...mockPlato,
        categoria: 'invalid' as CategoriaPlato,
      };

      await expect(service.create(invalidPlato)).rejects.toThrow(BusinessLogicException);
    });
  });

  describe('update', () => {
    it('should update a dish when it exists', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockPlato);
      jest.spyOn(repository, 'save').mockResolvedValue({
        ...mockPlato,
        nombre: 'Updated Name',
      });

      const result = await service.update(1, {
        ...mockPlato,
        nombre: 'Updated Name',
      });
      expect(result.nombre).toBe('Updated Name');
    });

    it('should throw BusinessLogicException when dish does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.update(1, mockPlato)).rejects.toThrow(BusinessLogicException);
    });
  });

  describe('delete', () => {
    it('should delete a dish when it exists', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockPlato);
      jest.spyOn(repository, 'remove').mockResolvedValue(mockPlato);

      await service.delete(1);
      expect(repository.remove).toHaveBeenCalledWith(mockPlato);
    });

    it('should throw BusinessLogicException when dish does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.delete(1)).rejects.toThrow(BusinessLogicException);
    });
  });
});
