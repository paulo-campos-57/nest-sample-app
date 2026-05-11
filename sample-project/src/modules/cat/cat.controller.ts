import { Controller, Get, Post, Put, Delete, Body } from '@nestjs/common';
import { CatService } from './cat.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './entities/cat.entity';

@Controller('cat')
export class CatController {
  constructor(private catService: CatService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    return this.catService.create(createCatDto);
  }

  @Get()
  findAll(): Promise<Cat[] | string> {
    return this.catService.findAll();
  }

  @Get(':id')
  findById(id: number): Promise<Cat> {
    return this.catService.findById(id);
  }

  @Put(':id')
  update(id: number, @Body() updateCatDto: CreateCatDto) {
    return this.catService.update(id, updateCatDto);
  }

  @Delete(':id')
  delete(id: number) {
    return this.catService.delete(id);
  }
}
