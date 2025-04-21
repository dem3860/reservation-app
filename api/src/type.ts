import { IAdminUserUseCase } from "./useCase/inputPort/admin/user.js";
import { IAuthUseCase } from "./useCase/inputPort/auth.js";

export type Deps = {
  authUseCase: IAuthUseCase;
  adminUserUseCase: IAdminUserUseCase;
};

export type AppType = {
  Variables: {
    deps: Deps;
  };
};
