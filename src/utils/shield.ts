import { JWTPayload } from "../strategies/controller";

export const isAuthenticated = async (
  role: ["admin", "user"],
  ctx: { user: JWTPayload | undefined },
) => {
  console.log(ctx.user);
  if (!ctx.user) {
    throw new Error("Unauthorized");
  }

  if (!role.includes(ctx.user.role)) {
    throw new Error("Forbidden");
  }
};
