import { IsString, IsNotEmpty, IsEmail, MaxLength, MinLength } from 'class-validator';
export class UsersRegisterDTO {
	@IsNotEmpty({ message: 'Username is empty' })
	@IsString({ message: 'Username is not string' })
	@MinLength(4, { message: 'The username is too short' })
	@MaxLength(50, { message: 'The uassword is too long' })
	username: string;
	
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
