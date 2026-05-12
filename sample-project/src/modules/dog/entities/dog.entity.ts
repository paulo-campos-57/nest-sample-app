import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('dogs')
export class Dog {
  @ApiProperty({
    example: 1,
    description: 'Id do cachorro',
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
