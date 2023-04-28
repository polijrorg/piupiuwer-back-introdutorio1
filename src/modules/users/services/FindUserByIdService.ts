import { inject, injectable } from 'tsyringe';

import { User } from '@prisma/client';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  id: string;
}

@injectable()
export default class FindUserByIdService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) { }

  public async execute({ id } : IRequest): Promise<Omit<User, 'password'>> {
    const user = await this.usersRepository.findById(id);

    if (!user) throw new AppError('User not found', 404);

    const { password: _, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }
}
