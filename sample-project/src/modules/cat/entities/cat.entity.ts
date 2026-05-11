import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cats')
export class Cat {
  @ApiProperty({
    example: 1,
    description: 'ID do gato',
  })
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'varchar',
    length: 100,
  })
  name!: string;

  @Column({
    type: 'int',
  })
  age!: number;

  @Column({
    type: 'varchar',
    length: 50,
  })
  breed!: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  color!: string;
}
