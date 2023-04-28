import ICreateUserDTO from './ICreateUserDTO';

interface IUpdateUserDTO {
  userId: string;
  user: ICreateUserDTO;
}

export default IUpdateUserDTO;
