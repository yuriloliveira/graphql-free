export const toDynamoDBItem = (item) =>
  Object
    .entries(item)
    .reduce((agg, currEntry) => ({
      ...agg,
      ...entryToDynamoDBItemAttr(currEntry)
    }), {})

export const dynamoDBItemToJson = (item) =>
  Object
  .entries(item)
  .reduce((agg, currEntry) => ({
    ...agg,
    ...dynamoDBItemEntryToJsonEntry(currEntry)
  }), {})

function entryToDynamoDBItemAttr([key, value]) {
  if (value == null || value == undefined) {
    return {}
  }

  if (typeof value === "number") {
    return { [key]: { N: String(value) } }
  }

  return { [key]: { S: value } } // defaults to String. Other types not supported by this implementation
}

function dynamoDBItemEntryToJsonEntry([key, dynamoDBItemAttr]) {
  const [[dynamoDBItemType, dynamoDBItemValue]] = Object.entries(dynamoDBItemAttr);
  if (dynamoDBItemValue == null || dynamoDBItemValue == undefined) {
    return {}
  }

  if (dynamoDBItemType === "N") {
    return { [key]: Number(dynamoDBItemValue) }
  }

  return { [key]: dynamoDBItemValue }
}