export const parseAuthToken = (token: string) => {
  const base64Url = token.split(' ')[1];
  const [login, password] = Buffer.from(base64Url, 'base64').toString().split(':');

  return { login, password, base64Url };
};
