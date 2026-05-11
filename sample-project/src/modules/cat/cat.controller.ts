import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  HttpStatus,
  HttpException,
  ParseIntPipe,
  Param,
  HttpCode,
} from '@nestjs/common';
import { CatService } from './cat.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './entities/cat.entity';

@Controller('cat')
export class CatController {
  constructor(private catService: CatService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    try {
      await this.catService.create(createCatDto);
      return { message: 'Cat created successfully' };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to create cat',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  @Get()
  findAll(): Promise<Cat[] | string> {
    try {
      return this.catService.findAll();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to find cats',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number): Promise<Cat> {
    return this.catService.findById(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCatDto: CreateCatDto,
  ) {
    return this.catService.update(id, updateCatDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.catService.delete(id);
  }
}
