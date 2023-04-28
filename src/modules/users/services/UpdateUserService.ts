import { inject, injectable } from 'tsyringe';

import { User } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IUpdateUserDTO from '../dtos/IUpdateUserDTO';

type IRequest = IUpdateUserDTO;

@injectable()
export default class UpdateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) { }

  public async execute({
    userId, user: {
      username,
      email,
      password,
      firstName,
      lastName,
      birthDate,
      about,
      avatar,
    },
  }: IRequest): Promise<Omit<User, 'password'>> {
    const userWithSameUsername = await this.usersRepository.findByUsername(username);

    if (userWithSameUsername && userWithSameUsername.id !== userId) throw new AppError('User with same username already exists');

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail && userWithSameEmail.id !== userId) throw new AppError('User with same email already exists');

    const hashedPassword = await this.hashProvider.generateHash(password);

    const { password: _, ...userWithoutPassword } = await this.usersRepository.update({
      userId,
      user: {
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        birthDate,
        about,
        avatar,
      },
    });

    return userWithoutPassword;
  }
}
