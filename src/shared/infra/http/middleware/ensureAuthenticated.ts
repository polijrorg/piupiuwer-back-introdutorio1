import { Request, Response, NextFunction } from 'express';
import { Secret, verify } from 'jsonwebtoken';
import AppError from '@shared/errors/AppError';
import FindUserByIdService from '@modules/users/services/FindUserByIdService';
import { container } from 'tsyringe';
import authConfig from '../../../../config/auth';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
  iss: string;
}

export default async function ensureAuthenticated(
  request: Request,
  _: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = request.headers.authorization;

  if (!authHeader) throw new AppError('JWT token is missing', 401);

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret as Secret);

    const { sub: id } = decoded as ITokenPayload;

    const findUserById = container.resolve(FindUserByIdService);

    const user = await findUserById.execute({ id });

    if (!user) throw new AppError('');

    request.user = {
      id,
    };

    return next();
  } catch (e) {
    throw new AppError(e ? 'This user was deleted' : 'JWT token is missing', 401);
  }
}
