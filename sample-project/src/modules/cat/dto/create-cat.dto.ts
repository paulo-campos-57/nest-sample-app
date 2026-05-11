import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateCatDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsInt()
  @Min(0)
  @Max(999)
  age!: number;

  @IsString()
  @IsNotEmpty()
  breed!: string;

  @IsString()
  @IsNotEmpty()
  color!: string;
}
