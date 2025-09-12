export class AuthResponseDTO {
  constructor(
    public accessToken: string,
    public refreshToken: string,
    public user: {
      id: string;
      name: string;
      email: string;
      phoneNumber: string;
    },
  ) {}
}

export class LoginDTO {
  constructor(
    public email: string,
    public password: string,
  ) {}
}


export class VerifyOtpDTO {
  constructor(
    public name: string,
    public email: string,
    public phoneNumber: string,
    public otp: string,
    public password: string,
  ) {}
}


export class ChangePasswordDTO {
  constructor(
    public userId: string,
    public oldPassword: string,
    public newPassword: string
  ) {}
}
