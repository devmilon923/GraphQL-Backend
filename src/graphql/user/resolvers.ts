import { prisma } from "../../utils/prisma";
import { isAuthenticated } from "../../utils/shield";

const queries = {
  user: async (_, __, ctx) => {
    await isAuthenticated(["admin", "user"], ctx);
    try {
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
  updateProfile: async (_, { payload }, ctx) => {
    await isAuthenticated(["admin"], ctx);
    try {
      const result = await prisma.user.update({
        where: {
          id: ctx.user.id,
        },
        data: {
          payload,
        },
      });
      return result;
    } catch (error) {
      throw new Error("Could not fetch users from the database.");
    }
  },
};

export const resolvers = { queries, mutations };
