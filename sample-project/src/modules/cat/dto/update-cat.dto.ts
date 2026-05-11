/*
This file contains the UpdateCatDto class, which extends the CreateCatDto using PartialType from @nestjs/mapped-types.
This allows all properties of CreateCatDto to be optional in UpdateCatDto, making it suitable for update operations where not all fields may be provided. 
The UpdateCatDto is used in the CatController's update method to validate incoming data for updating a cat's information.
*/
import { PartialType } from '@nestjs/mapped-types';
import { CreateCatDto } from './create-cat.dto';

export class UpdateCatDto extends PartialType(CreateCatDto) {}
