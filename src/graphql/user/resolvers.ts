import { prisma } from "../../utils/prisma";
import { isAuthenticated } from "../../utils/shield";

const queries = {
  users: async (_, __, ctx) => {
    await isAuthenticated(["admin", "user"], ctx);
    try {
      const result = await prisma.user.findMany();
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
