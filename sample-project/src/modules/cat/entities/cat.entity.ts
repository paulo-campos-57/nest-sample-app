/*
This file defines the Cat entity for the NestJS application using TypeORM. 
The Cat class is decorated with @Entity to indicate that it is a database entity, 
and it includes properties such as id, name, age, breed, and color. 
Each property is decorated with @Column to specify its type and constraints in the database. 
The id property is decorated with @PrimaryGeneratedColumn to indicate that it is an auto-incrementing primary key. 
Additionally, the ApiProperty decorator from @nestjs/swagger is used to provide metadata for API documentation generation.
*/
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
