import { IsString, IsOptional, IsEnum, MinLength, Matches } from 'class-validator';
import { Role } from '../../users/user.entity';

export class RegisterDto {
  email!: string;
  firstName!: string;
  lastName!: string;

  @IsString()
  @MinLength(8)
  // @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/, {
  //   message: 'Password must contain lowercase, uppercase, number, and symbol',
  // })
  password!: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
