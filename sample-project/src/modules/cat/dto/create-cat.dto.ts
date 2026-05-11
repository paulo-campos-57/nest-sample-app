import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateCatDto {
  @ApiProperty({
    example: 'Brulee',
    description: 'Nome do gato',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 3,
    description: 'Idade do gato',
  })
  @IsInt()
  @Min(0)
  age!: number;

  @ApiProperty({
    example: 'Vira Lata',
    description: 'Raça do gato',
  })
  @IsString()
  @IsNotEmpty()
  breed!: string;

  @ApiProperty({
    example: 'Preto',
    description: 'Cor do gato',
  })
  @IsString()
  @IsNotEmpty()
  color!: string;
}
