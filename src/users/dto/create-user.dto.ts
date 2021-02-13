export class CreateUserDto {
  fullName: string;
  password: string;
  confirmedPassword: string;
  email: string;
  confirmHash?: string;
}
