import { GetItemCommand, PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { ddbClient } from "./client.mjs";
import { toDynamoDBItem, dynamoDBItemToJson } from "./utils.mjs";

export const TABLE_NAME = "Goals";

export const goalClient = {
  findGoalById: async (id) => {
    const getGoalIdByCommand = new GetItemCommand({
      TableName: TABLE_NAME,
      Key: {
        id: { S: id }
      }
    });
    console.log(JSON.stringify({ getGoalIdByCommand }));
    const foundGoal = await ddbClient.send(getGoalIdByCommand);
    console.log(JSON.stringify({ foundGoal }));
    return parseGoal(foundGoal.Item);
  },
  findAllGoals: async () => {
    const scanGoalsCommand = new ScanCommand({ TableName: TABLE_NAME });
    console.log(JSON.stringify({ scanGoalsCommand }));
    const allGoals = await ddbClient.send(scanGoalsCommand).catch(err => { console.error(err); return null; });
    console.log(JSON.stringify({ allGoals }));
    return (allGoals?.Items ?? []).map(parseGoal)
  },
  createGoal: async (goalToBeCreated) => {
    const goalItem = toDynamoDBItem(goalToBeCreated)
    console.log({ goalItem: JSON.stringify(goalItem) });
    const putGoalItemCommand = new PutItemCommand({
      TableName: TABLE_NAME,
      Item: goalItem
    });
    console.log({ PutItemCommand: JSON.stringify(putGoalItemCommand) })
    const createdGoal = await ddbClient.send(putGoalItemCommand).catch(err => { console.error(err); throw err; });;
    console.log({ createdGoal: JSON.stringify(createdGoal) });
    return goalClient.findGoalById(goalToBeCreated.id);
  }
}

function parseGoal(goal) {
  if (goal === null || goal === undefined) {
    return null;
  }

  const transformedGoal = dynamoDBItemToJson(goal);
  return {
      ...transformedGoal,
      savedAmount: transformedGoal?.savedAmount ?? 0
    }
}