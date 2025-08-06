import { IsString, IsNotEmpty, IsEmail, MaxLength, MinLength } from 'class-validator';
export class UsersLoginDTO {
	@IsNotEmpty({ message: 'Email is empty' })
	@IsString({ message: 'Email is not string' })
	@IsEmail({ message: 'Is not email' })
	email: string;
	
	@IsNotEmpty({ message: 'Password is empty' })
	@IsString({ message: 'Password is not a string' })
	@MinLength(6, { message: 'The password is too short' })
	@MaxLength(25, { message: 'The password is too long' })
	password: string;
}
