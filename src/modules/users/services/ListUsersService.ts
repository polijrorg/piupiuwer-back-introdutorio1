import { inject, injectable } from 'tsyringe';

import { User } from '@prisma/client';

import IUsersRepository from '../repositories/IUsersRepository';

@injectable()
export default class ListUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) { }

  public async execute(): Promise<Omit<User, 'password'>[]> {
    const usersWithoutPassword = (await this.usersRepository.list()).map(({ password: _, ...userWithoutPassword }) => userWithoutPassword);

    return usersWithoutPassword;
  }
}
