import { inject, injectable } from 'tsyringe';

import { User } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import ICreateUserDTO from '../dtos/ICreateUserDTO';

type IRequest = ICreateUserDTO;

@injectable()
export default class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) { }

  public async execute({
    username,
    email,
    password,
    firstName,
    lastName,
    birthDate,
    about,
    avatar,
  }: IRequest): Promise<Omit<User, 'password'>> {
    const userWithSameUsername = await this.usersRepository.findByUsername(username);

    if (userWithSameUsername) throw new AppError('User with same username already exists');

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) throw new AppError('User with same email already exists');

    const hashedPassword = await this.hashProvider.generateHash(password);

    const { password: _, ...userWithoutPassword } = await this.usersRepository.create({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      birthDate,
      about,
      avatar,
    });

    return userWithoutPassword;
  }
}
