const AWS = require("aws-sdk");

AWS.config.update({
    region: "us-east-2", // Ohio
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
});

const docClient = new AWS.DynamoDB.DocumentClient();
const table = "CoffeeTrackerPro";

exports.handler = async function (event, context, callback) {
    try {
        const numToday = await numberBrewedToday(event.offset);
        const numAllTime = await numberBrewedAllTime();
        const mostRecentBrew = await mostRecent();

        const dashboard = {
            numToday,
            numAllTime,
            mostRecentBrew
        };
        callback(null, dashboard);
    }
    catch (ex) {
        console.log(JSON.stringify(ex));
        callback(new Error(JSON.stringify(ex)));
    }
}

async function mostRecent() {
    return new Promise((resolve, reject) => {
        const params = {
            TableName: table,
            ScanIndexForward: false,
            KeyConditionExpression: "#t = :val",
            ExpressionAttributeValues: {
                ":val": "brew"
            },
            ExpressionAttributeNames: {
                "#t": "type",
                "#time": "timestamp"
            },
            ProjectionExpression: "#time",
            Limit: 1
        }
        docClient.query(params, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                if (data.Items.length > 0)
                    resolve(data.Items[0].timestamp);
                else
                    resolve(null);
            }
        });
    })
}

async function numberBrewedToday(offset) {
    return new Promise((resolve, reject) => {
        // If no offset is specified, we'll return the number brewed on
        // the current UTC day. 
        if (!offset)
            offset = 0;
        console.log(`Offset: ${offset}`);

        let min = new Date();
        let max = new Date();

        // Set min to midnight
        min.setHours(0);
        min.setMinutes(0);
        min.setSeconds(0);
        min.setMilliseconds(0);

        // Set max to 23:59:59.999
        max.setHours(23);
        max.setMinutes(59);
        max.setSeconds(59);
        max.setMilliseconds(999);

        // Account for the offset between the REQUEST's timezone
        // and the SERVER's timezone
        const diff = offset - min.getTimezoneOffset();
        min = new Date(min.valueOf() + diff * 60 * 1000);
        max = new Date(max.valueOf() + diff * 60 * 1000);

        console.log(`Min: ${min.toISOString()}`);
        console.log(`Max: ${max.toISOString()}`);

        const params = {
            TableName: table,
            ScanIndexForward: false,
            KeyConditionExpression: "#t = :val AND #time BETWEEN :minDate AND :maxDate",
            ExpressionAttributeValues: {
                ":val": "brew",
                ":minDate": min.toISOString(),
                ":maxDate": max.toISOString()
            },
            ExpressionAttributeNames: {
                "#t": "type",
                "#time": "timestamp"
            },
            Select: "COUNT"
        }
        docClient.query(params, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data.Count);
            }
        });
    })
}

async function numberBrewedAllTime() {
    return new Promise((resolve, reject) => {
        const params = {
            TableName: table,
            ScanIndexForward: false,
            KeyConditionExpression: "#t = :val",
            ExpressionAttributeValues: {
                ":val": "brew"
            },
            ExpressionAttributeNames: {
                "#t": "type"
            },
            Select: "COUNT"
        }
        docClient.query(params, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data.Count);
            }
        });
    })
}