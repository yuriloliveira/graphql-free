import { ApolloServer, gql } from 'apollo-server-lambda';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { v4 as uuid } from "uuid";

import { goalClient } from "./dynamodb/index.mjs";

const typeDefs = gql`
  type Goal {
    id: ID!
    title: String!,
    savedAmount: Float!,
    targetAmount: Float,
    description: String,
    targetDate: String
  }
  type Query {
    goal(id: ID!): Goal,
    goals: [Goal!]!
  }
  type Mutation {
    addGoal(title: String!, savedAmount: Float, targetAmount: Float, description: String, targetDate: String): Goal
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    goal: async (_, { id }) => {
      return goalClient.findGoalById(id);
    },
    goals: async () => {
      return goalClient.findAllGoals();
    },
  },
  Mutation: {
    addGoal: async (_, goal) => {
      const goalToBeCreated = { id: uuid(), ...goal };
      return goalClient.createGoal(goalToBeCreated);
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

export const handler = server.createHandler();