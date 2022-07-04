export type Methods = {
  post: {
    reqBody: {
      session: true;
      email: string;
      password: string;
    };
    status: 200 | 401 | 404;
  };
};
