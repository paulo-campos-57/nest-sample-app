import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { Dog } from './entities/dog.entity';
import { DogRepository } from './dog.repository';
import { CreateDogDto } from './dto/create-dog.dto';
import { UpdateDogDto } from './dto/update-dog.dto';
import { WhatsAppService } from '../../common/services/whatsapp.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DogService {
  constructor(
    private readonly dogRepository: DogRepository,
    private readonly whatsappService: WhatsAppService,
    private readonly configService: ConfigService,
  ) {}

  async createDog(data: CreateDogDto): Promise<Dog> {
    const dog = await this.dogRepository.createDog(data);

    if (!dog) {
      throw new InternalServerErrorException('Failed to create dog');
    }

    const phone = this.configService.get<string>('PHONE_NUMBER1');
    console.log(process.env.PHONE_NUMBER1);
    console.log(phone);
    if (!phone) {
      throw new NotFoundException('Phone number not found');
    }

    await this.whatsappService
      .sendMessage(
        phone,
        `🐶 Novo cachorro cadastrado!

      Nome: ${dog.name}
      Idade: ${dog.age}
      Raça: ${dog.breed}
      Cor: ${dog.color}`,
      )
      .catch((error) => {
        console.error('Failed to send WhatsApp notification: ', error);
      });

    return dog;
  }

  async findAll(): Promise<Dog[] | string> {
    const dogs = await this.dogRepository.findAll();

    if (dogs.length === 0) {
      return 'No dogs found yet';
    }

    return dogs;
  }

  async findById(id: number): Promise<Dog> {
    const dog = await this.dogRepository.findById(id);

    if (!dog) {
      throw new NotFoundException(`Dog with id ${id} not found`);
    }

    return dog;
  }

  async update(id: number, data: UpdateDogDto): Promise<Dog> {
    const dog = await this.dogRepository.update(id, data);

    if (dog === null) {
      throw new NotFoundException(`Dog with id ${id} not found`);
    }

    return dog;
  }

  async delete(id: number): Promise<void> {
    const deleted = await this.dogRepository.delete(id);

    if (!deleted) {
      throw new NotFoundException(`Dog with id ${id} not found`);
    }
  }
}
