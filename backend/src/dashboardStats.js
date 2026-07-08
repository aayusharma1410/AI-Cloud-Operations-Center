const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async () => {
  try {
    const result = await docClient.send(
      new ScanCommand({
        TableName: process.env.INCIDENT_TABLE,
      })
    );

    const incidents = result.Items || [];

    const stats = {
      total: incidents.length,
      open: incidents.filter(i => i.status === "OPEN").length,
      critical: incidents.filter(i => i.severity === "Critical").length,
      resolved: incidents.filter(i => i.status === "RESOLVED").length,
    };

    return {
      statusCode: 200,
      body: JSON.stringify(stats),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
