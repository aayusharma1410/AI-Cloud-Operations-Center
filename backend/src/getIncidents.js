const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
} = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);

    const incident = {
      incidentId: `INC-${uuidv4().substring(0, 8).toUpperCase()}`,
      service: body.service,
      errorType: body.errorType,
      severity: body.severity,
      status: "OPEN",
      createdAt: new Date().toISOString(),
      aiAnalysis: "",
      recommendation: "",
    };

    await docClient.send(
      new PutCommand({
        TableName: process.env.INCIDENT_TABLE,
        Item: incident,
      })
    );

    return {
      statusCode: 201,
      body: JSON.stringify(incident),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
