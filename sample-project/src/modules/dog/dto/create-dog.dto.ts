import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateDogDto {
  @ApiProperty({
    example: 'Rufus',
    description: 'Nome do cachorro',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: '5',
    description: 'Idade do cachorro',
  })
  @IsInt()
  @Min(0)
  @Max(999)
  age!: number;

  @ApiProperty({
    example: 'Raça do cachorro',
    description: 'Buldogue',
  })
  @IsString()
  breed!: string;
  @ApiProperty({
    example: 'Marrom alaranjado',
    description: 'Cor do cachorro',
  })
  @IsString()
  color!: string;
}
