import { UserProps } from "domain/entity/user";

export type Methods = {
  get: {
    resBody: UserProps;
    status: 200 | 401;
  };
};
