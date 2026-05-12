import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { DogService } from './dog.service';
import { CreateDogDto } from './dto/create-dog.dto';
import { Dog } from './entities/dog.entity';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateDogDto } from './dto/update-dog.dto';

@ApiTags('dogs')
@Controller('dogs')
export class DogController {
  constructor(private readonly dogService: DogService) {}
  @Post()
  @ApiOperation({ summary: 'Create a new dog' })
  @ApiCreatedResponse({
    description: 'Dog created successfully',
    type: Dog,
  })
  async create(@Body() createDogDto: CreateDogDto): Promise<Dog> {
    return this.dogService.createDog(createDogDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all dogs' })
  @ApiOkResponse({
    description: 'List of dogs',
    type: Dog,
    isArray: true,
  })
  findAll(): Promise<Dog[] | string> {
    return this.dogService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a dog by id' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
  })
  @ApiOkResponse({
    description: 'Dog found',
    type: Dog,
  })
  @ApiNotFoundResponse({
    description: 'Dog not found',
  })
  findById(@Param('id', ParseIntPipe) id: number): Promise<Dog> {
    return this.dogService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a dog' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
  })
  @ApiOkResponse({
    description: 'Dog updated successfully',
    type: Dog,
  })
  @ApiNotFoundResponse({
    description: 'Dog not found',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDogDto: UpdateDogDto,
  ): Promise<Dog | null> {
    return this.dogService.update(id, updateDogDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a dog' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
  })
  @ApiNoContentResponse({
    description: 'Dog deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'Dog not found',
  })
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.dogService.delete(id);
  }
}
