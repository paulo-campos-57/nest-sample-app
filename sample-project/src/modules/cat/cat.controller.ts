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

import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { CatService } from './cat.service';
import { Cat } from './entities/cat.entity';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';

@ApiTags('cats')
@Controller('cats')
export class CatController {
  constructor(private readonly catService: CatService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new cat' })
  @ApiCreatedResponse({
    description: 'Cat created successfully',
    type: Cat,
  })
  async create(@Body() createCatDto: CreateCatDto): Promise<Cat> {
    return this.catService.create(createCatDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all cats' })
  @ApiOkResponse({
    description: 'List of cats',
    type: Cat,
    isArray: true,
  })
  findAll(): Promise<Cat[] | string> {
    return this.catService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a cat by id' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
  })
  @ApiOkResponse({
    description: 'Cat found',
    type: Cat,
  })
  @ApiNotFoundResponse({
    description: 'Cat not found',
  })
  findById(@Param('id', ParseIntPipe) id: number): Promise<Cat> {
    return this.catService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a cat' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
  })
  @ApiOkResponse({
    description: 'Cat updated successfully',
    type: Cat,
  })
  @ApiNotFoundResponse({
    description: 'Cat not found',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCatDto: UpdateCatDto,
  ): Promise<Cat | null> {
    return this.catService.update(id, updateCatDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a cat' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
  })
  @ApiNoContentResponse({
    description: 'Cat deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'Cat not found',
  })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.catService.delete(id);
  }
}
