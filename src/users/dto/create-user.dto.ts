import { IsOptional, IsEnum } from 'class-validator';
import { Role } from '../user.entity';

export class CreateUserDto {
  email!: string;
  firstName!: string;
  lastName!: string;
  password!: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
