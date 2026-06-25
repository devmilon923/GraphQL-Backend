import { GraphQLError } from "graphql";
import { JWTPayload } from "../strategies/controller";

export const isAuthenticated = async (
  roles: ("admin" | "user")[], // Allows flexible arrays like ["admin"]
  ctx: { user: JWTPayload | undefined },
) => {
  if (!ctx.user) {
    throw new GraphQLError("You must be logged in to view this resource.", {
      extensions: {
        code: "UNAUTHORIZED",
        http: { status: 401 },
      },
    });
  }

  if (!roles.includes(ctx.user.role as any)) {
    throw new GraphQLError(
      "You do not have permission to access this resource.",
      {
        extensions: {
          code: "FORBIDDEN",
          http: { status: 403 },
        },
      },
    );
  }
};
