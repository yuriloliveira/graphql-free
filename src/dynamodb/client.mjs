import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
const { NODE_ENV } = process.env;

export const REGION = "us-east-1";

console.log({ NODE_ENV });

const endpointConfig = NODE_ENV?.toLowerCase() === "production"
  ? null
  : { endpoint: process.env.DYNAMODB_ENDPOINT || "http://localstack:4566" };

  export const ddbClient = new DynamoDBClient({
  region: REGION,
  ...endpointConfig
});

export const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);