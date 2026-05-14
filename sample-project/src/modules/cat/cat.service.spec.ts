/*
This file contains unit tests for the CatService class.
The tests validate the business logic for creating, retrieving, updating,
and deleting cats.
All external dependencies are mocked to isolate the service behavior.
The WhatsAppService and ConfigService are mocked only to satisfy dependency
injection, but their behavior is not part of these tests.
The test suite also verifies that the service throws the appropriate
HTTP exceptions when operations fail or when a cat is not found.
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

import { CatService } from './cat.service';
import { CatRepository } from './cat.repository';
import { WhatsAppService } from '../../common/services/whatsapp.service';

import { Cat } from './entities/cat.entity';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';

describe('CatService', () => {
  let service: CatService;
  let catRepository: jest.Mocked<CatRepository>;

  const mockCat: Cat = {
    id: 1,
    name: 'Mimi',
    age: 2,
    breed: 'Persian',
    color: 'White',
  };

  const createCatDto: CreateCatDto = {
    name: 'Mimi',
    age: 2,
    breed: 'Persian',
    color: 'White',
  };

  const updateCatDto: UpdateCatDto = {
    name: 'Luna',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatService,
        {
          provide: CatRepository,
          useValue: {
            createCat: jest.fn(),
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

    service = module.get<CatService>(CatService);
    catRepository = module.get(CatRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a cat successfully', async () => {
      catRepository.createCat.mockResolvedValue(mockCat);

      const result = await service.create(createCatDto);

      expect(result).toEqual(mockCat);
      expect(catRepository.createCat).toHaveBeenCalledWith(createCatDto);
    });

    it('should throw InternalServerErrorException if cat creation fails', async () => {
      catRepository.createCat.mockResolvedValue(null as never);

      await expect(service.create(createCatDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all cats', async () => {
      catRepository.findAll.mockResolvedValue([mockCat]);

      const result = await service.findAll();

      expect(result).toEqual([mockCat]);
    });

    it('should return a message when no cats are found', async () => {
      catRepository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toBe('No cats found yet');
    });
  });

  describe('findById', () => {
    it('should return a cat by id', async () => {
      catRepository.findById.mockResolvedValue(mockCat);

      const result = await service.findById(1);

      expect(result).toEqual(mockCat);
    });

    it('should throw NotFoundException when cat is not found', async () => {
      catRepository.findById.mockResolvedValue(null);

      await expect(service.findById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the cat', async () => {
      const updatedCat = { ...mockCat, ...updateCatDto };

      catRepository.update.mockResolvedValue(updatedCat);

      const result = await service.update(1, updateCatDto);

      expect(result).toEqual(updatedCat);
      expect(catRepository.update).toHaveBeenCalledWith(1, updateCatDto);
    });

    it('should throw NotFoundException when cat does not exist', async () => {
      catRepository.update.mockResolvedValue(null);

      await expect(service.update(1, updateCatDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete the cat successfully', async () => {
      catRepository.delete.mockResolvedValue(true);

      await expect(service.delete(1)).resolves.toBeUndefined();

      expect(catRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when cat does not exist', async () => {
      catRepository.delete.mockResolvedValue(false);

      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
    });
  });
});
