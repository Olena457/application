// import { ApiProperty } from '@nestjs/swagger';
// import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

// export class RegisterDto {
//   @ApiProperty({ example: 'user@example.com' })
//   @IsEmail()
//   @IsNotEmpty()
//   email: string;

//   @ApiProperty({ example: 'SecurePass123!', minLength: 6 })
//   @IsString()
//   @IsNotEmpty()
//   @MinLength(6, { message: 'Password must be at least 6 characters' })
//   password: string;

//   @ApiProperty({ example: 'John Doe', required: false })
//   @IsString()
//   @IsOptional()
//   name?: string;
// }
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ example: 'SecurePass123!', minLength: 6 })
  password!: string;

  @ApiProperty({ example: 'John Doe', required: false })
  name?: string;
}
