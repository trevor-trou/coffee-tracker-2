const AWS = require("aws-sdk");
const webpush = require('web-push');

AWS.config.update({
    region: "us-east-2", // Ohio
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
});

webpush.setVapidDetails(
    process.env.VAPID_CONTACT,
    process.env.VAPID_PUBLIC,
    process.env.VAPID_PRIVATE
);

const notification = {
    title: "Coffee Tracker Pro",
    options: {
        body: "Coffee is Ready",
        icon: "images/coffee.png"
    }
}

exports.handler = function (event, context, callback) {
    const docClient = new AWS.DynamoDB.DocumentClient();
    const ISOString = (new Date()).toISOString();

    brewCoffee(docClient, event, ISOString).then(data => {
        getSubscriptions(docClient).then(pushSubs => {
            sendNotifications(pushSubs, ISOString).then(() => {
                callback(null, "Success");
            }).catch(err => {
                callback(null, "Coffee Logged, Notification error: " + JSON.stringify(err));
            })
        }).catch(err => {
            console.error(JSON.stringify(err));
            callback(new Error(err));
        })
    }).catch(err => {
        console.error(JSON.stringify(err));
        callback(new Error(err));
    });
}

/**
 * Record the brew in the database
 * @param {AWS.DynamoDB.DocumentClient} client 
 */
function brewCoffee(client, event, ISOString) {
    return new Promise((resolve, reject) => {
        const table = "CoffeeTrackerPro";

        const params = {
            TableName: table,
            Item: {
                type: "brew",
                timestamp: ISOString,
                apiKey: event["x-api-key"] || null
            }
        }

        console.log(`Adding new brew for: ${params.Item.timestamp}`);
        client.put(params, (err, data) => {
            if (err) {
                console.error(JSON.stringify(err));
                reject(err);
            }
            else {
                console.log("Brew successfully recorded.");
                resolve(data);
            }
        });
    });
}

/**
 * Get all available PushSubscriptions
 * @param {AWS.DynamoDB.DocumentClient} client 
 */
function getSubscriptions(client) {
    return new Promise((resolve, reject) => {
        const table = "CoffeeTracker-Subscriptions";

        const params = {
            TableName: table
        };

        client.scan(params, (err, data) => {
            if (err) {
                console.error(JSON.stringify(err));
                reject(err);
            }
            else {
                console.log(`Fetched ${data.Count} subscriptions.`);
                resolve(data.Items);
            }
        });
    });
}

/**
 * Send notifications to subscribed users
 * @param {AWS.DynamoDB.DocumentClient} client 
 */
function sendNotifications(subscriptions, ISOString) {
    return new Promise((resolve, reject) => {
        const toSend = {
            payload: {
                type: "brew",
                data: ISOString
            },
            notification: notification
        };
        const payload = JSON.stringify(toSend);

        let promiseChain = Promise.resolve();

        for (let i = 0; i < subscriptions.length; i++) {
            const subscription = subscriptions[i];
            promiseChain = promiseChain.then(() => {
                return triggerPushMsg(subscription, payload);
            });
        }

        promiseChain.then(() => {
            resolve();
        }).catch(err => {
            reject(err);
        });
    });
}

function triggerPushMsg(subscription, payload) {
    return webpush.sendNotification(subscription, payload, {
        TTL: 300
    }).catch((err) => {
        if (err.statusCode === 410) {
            console.log('No longer subscribed...');
        } else {
            console.log('Subscription is no longer valid: ', err);
        }
    });
}