interface ICreateUserDTO {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  about?: string;
  avatar?: string;
}

export default ICreateUserDTO;
