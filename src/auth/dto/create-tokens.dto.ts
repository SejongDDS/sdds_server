export class CreateTokenInput {
  id: number;
  login_id: string;
}

export class CreateTokensOutput {
  access_token?: string;
  refresh_token?: string;
}
