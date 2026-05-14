/*
This file contains unit tests for the DogService class.
The tests validate the business logic for creating, retrieving, updating,
and deleting dogs.
The WhatsApp functionality is mocked but not tested, since it is still under development.
*/

jest.mock('../../common/services/whatsapp.service', () => ({
  WhatsAppService: jest.fn().mockImplementation(() => ({
    sendMessage: jest.fn().mockResolvedValue(undefined),
  })),
}));

import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { DogService } from './dog.service';
import { DogRepository } from './dog.repository';
import { WhatsAppService } from '../../common/services/whatsapp.service';

import { Dog } from './entities/dog.entity';
import { CreateDogDto } from './dto/create-dog.dto';
import { UpdateDogDto } from './dto/update-dog.dto';

describe('DogService', () => {
  let service: DogService;
  let dogRepository: jest.Mocked<DogRepository>;

  const mockDog: Dog = {
    id: 1,
    name: 'Rex',
    age: 3,
    breed: 'Labrador',
    color: 'Golden',
  };

  const createDogDto: CreateDogDto = {
    name: 'Rex',
    age: 3,
    breed: 'Labrador',
    color: 'Golden',
  };

  const updateDogDto: UpdateDogDto = {
    name: 'Thor',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DogService,
        {
          provide: DogRepository,
          useValue: {
            createDog: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: WhatsAppService,
          useValue: {
            sendMessage: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('5581999999999'),
          },
        },
      ],
    }).compile();

    service = module.get<DogService>(DogService);
    dogRepository = module.get(DogRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createDog', () => {
    it('should create and return a dog', async () => {
      dogRepository.createDog.mockResolvedValue(mockDog);

      const result = await service.createDog(createDogDto);

      expect(result).toEqual(mockDog);
      expect(dogRepository.createDog).toHaveBeenCalledWith(createDogDto);
    });

    it('should throw InternalServerErrorException if dog creation fails', async () => {
      dogRepository.createDog.mockResolvedValue(null as never);

      await expect(service.createDog(createDogDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all dogs', async () => {
      dogRepository.findAll.mockResolvedValue([mockDog]);

      const result = await service.findAll();

      expect(result).toEqual([mockDog]);
    });

    it('should return a message when no dogs are found', async () => {
      dogRepository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toBe('No dogs found yet');
    });
  });

  describe('findById', () => {
    it('should return a dog by id', async () => {
      dogRepository.findById.mockResolvedValue(mockDog);

      const result = await service.findById(1);

      expect(result).toEqual(mockDog);
    });

    it('should throw NotFoundException when dog is not found', async () => {
      dogRepository.findById.mockResolvedValue(null);

      await expect(service.findById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the dog', async () => {
      const updatedDog = { ...mockDog, ...updateDogDto };

      dogRepository.update.mockResolvedValue(updatedDog);

      const result = await service.update(1, updateDogDto);

      expect(result).toEqual(updatedDog);
      expect(dogRepository.update).toHaveBeenCalledWith(1, updateDogDto);
    });

    it('should throw NotFoundException when dog does not exist', async () => {
      dogRepository.update.mockResolvedValue(null);

      await expect(service.update(1, updateDogDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete the dog successfully', async () => {
      dogRepository.delete.mockResolvedValue(true);

      await expect(service.delete(1)).resolves.toBeUndefined();

      expect(dogRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when dog does not exist', async () => {
      dogRepository.delete.mockResolvedValue(false);

      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
    });
  });
});
