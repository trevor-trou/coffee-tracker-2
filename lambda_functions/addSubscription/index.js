const AWS = require("aws-sdk");
const uuidv4 = require('uuid/v4');

AWS.config.update({
    region: "us-east-2", // Ohio
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
});

exports.handler = function (event, context, callback) {
    try {
        const sub = typeof(event.body) === 'string' ?
        JSON.parse(event.body) : event.body;
        if (sub && validateSub(sub)) {
            console.log("Subscription is valid.");
            const docClient = new AWS.DynamoDB.DocumentClient();
            const table = "CoffeeTracker-Subscriptions";

            const id = uuidv4();

            const params = {
                TableName: table,
                Item: {
                    SubscriptionId: id,
                    ...sub
                }
            }

            docClient.put(params, (err, data) => {
                if(err) {
                    console.error(JSON.stringify(err));
                    callback(new Error(err));
                }
                else {
                    console.log("Success.");
                    callback(null, data);
                }
            });
        }
        else {
            throw 'Invalid subscription';
        }
    }
    catch (ex) {
        callback(new Error(ex));
    }
}

function validateSub(sub) {
    let valid = true;

    if (!sub.endpoint)
        valid = false;

    if (!sub.keys)
        valid = false;

    return valid;
}