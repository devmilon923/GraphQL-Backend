import { prisma } from "../../utils/prisma";

const queries = {
  users: async () => {
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
