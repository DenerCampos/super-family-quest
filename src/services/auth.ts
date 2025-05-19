export const AuthService = {
//   async login(email: string, password: string) {
//     const response = await api.post('/auth/login', {
//       email,
//       password,
//     });

//     return response.data;
//   },

  login: async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{ accessToken: string }> => {
    console.log(email, password);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      accessToken: 'token123',
    };
  },
};
