const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-2", // Ohio
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
});

const docClient = new AWS.DynamoDB.DocumentClient();
const table = "CoffeeTrackerPro";

exports.handler = async function(event, context, callback) {
  try {
    const numToday = await numberBrewedToday(event.min, event.max);
    const numAllTime = await numberBrewedAllTime();
    const mostRecentBrew = await mostRecent();

    const dashboard = {
      numToday,
      numAllTime,
      mostRecentBrew
    };
    callback(null, dashboard);
  } catch (ex) {
    console.log(JSON.stringify(ex));
    callback(new Error(JSON.stringify(ex)));
  }
};

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
    };
    docClient.query(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        if (data.Items.length > 0) resolve(data.Items[0].timestamp);
        else resolve(null);
      }
    });
  });
}

async function numberBrewedToday(min, max) {
  return new Promise((resolve, reject) => {
    // If no offset is specified, we'll return the number brewed on
    // the current UTC day.
    if (!min || !max) {
      let minDate = new Date();
      let maxDate = new Date();

      // Set min to midnight
      minDate.setHours(0);
      minDate.setMinutes(0);
      minDate.setSeconds(0);
      minDate.setMilliseconds(0);

      // Set max to 23:59:59.999
      maxDate.setHours(23);
      maxDate.setMinutes(59);
      maxDate.setSeconds(59);
      maxDate.setMilliseconds(999);

      min = minDate.toISOString();
      max = maxDate.toISOString();
    }

    console.log(`Min: ${min}`);
    console.log(`Max: ${max}`);

    const params = {
      TableName: table,
      ScanIndexForward: false,
      KeyConditionExpression:
        "#t = :val AND #time BETWEEN :minDate AND :maxDate",
      ExpressionAttributeValues: {
        ":val": "brew",
        ":minDate": min,
        ":maxDate": max
      },
      ExpressionAttributeNames: {
        "#t": "type",
        "#time": "timestamp"
      },
      Select: "COUNT"
    };
    docClient.query(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Count);
      }
    });
  });
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
    };
    docClient.query(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        // To account for historical data...
        const total = data.Count + 832;
        resolve(total);
      }
    });
  });
}
