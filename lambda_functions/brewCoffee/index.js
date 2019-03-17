const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-2", // Ohio
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
});

exports.handler = function(event, context, callback) {
    // success:
    // callback(null, {ex: "result"});
    // fail:
    // callback(new Error("what happened?"));
    const docClient = new AWS.DynamoDB.DocumentClient();
    const table = "CoffeeTrackerPro";

    const params = {
        TableName: table,
        Item: {
            type: "brew",
            timestamp: (new Date()).toISOString(),
            apiKey: event["x-api-key"] || null
        }
    }

    console.log(`Adding new brew for: ${params.Item.timestamp}`);
    docClient.put(params, (err, data) => {
        if(err) {
            console.error(JSON.stringify(err));
            callback(new Error(JSON.stringify(err)));
        }
        else {
            console.log("Success.");
            callback(null, data);
        }
    });
}