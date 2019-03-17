const AWS = require("aws-sdk");
const uuidV4 = require('uuid/v4');

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
    const table = "ctp_brews";

    const id = uuidV4();
    const params = {
        TableName: table,
        Item: {
            BrewId: id,
            Timestamp: (new Date()).toISOString(),
            APIKey: event["x-api-key"] || null
        }
    }

    console.log(`Adding new item with BrewId: ${id}`);
    docClient.put(params, (err, data) => {
        if(err) {
            console.error(JSON.stringify(err));
            callback(new Error(JSON.stringify(err)));
        }
        else {
            console.log("Item successfully added.");
            callback(null, JSON.stringify(data));
        }
    });
}