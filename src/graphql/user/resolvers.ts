import { prisma } from "../../utils/prisma";
import { isAuthenticated } from "../../utils/shield";

const queries = {
  user: async (_, __, ctx) => {
    await isAuthenticated(["admin", "user"], ctx);
    try {
      // console.log(ctx.user);
      const result = await prisma.user.findUnique({
        where: {
          uniqueUser: {
            oauthid: ctx.user.oauthid,
            email: ctx.user.email,
          },
        },
      });

      return result;
    } catch (error) {
      console.error("Database fetch failed:", error);
      throw new Error("Could not fetch users from the database.");
    }
  },
};

const mutations = {
  createUser: async () => "Hello",
};

export const resolvers = { queries, mutations };
