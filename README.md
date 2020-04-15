# Coffee Tracker Pro
This project is meant to track how old the coffee is, and how many pots we've brewed. Users can subscribe to receive notifications when a pot of coffee finishes brewing.

See https://coffee.trouchon.com

### Coffee Logging Device
The first part of the logging device is a discrete-time bandpass filter used to pinpoint the 4000 Hz beep emitted by the coffee pot after a brew completes. This filter contains an additional stages to ensure the detected beep matches the duration of that emitted by the coffee pot. Finally, the "beep detection filter" interfaces with a Raspberry Pi running a service (daemon, written in Python) that generates a POST request to the [Coffee Tracker API](#api) to log the brew.

### Website
The website is build using React. The static, built resources are hosted on an S3 bucket, behind a CloudFront distribution. When the website loads, a request is made to the Coffee Tracker API to populate the data on the page. If a user is subscribed, each time a new pot of coffee is brewed, the data on the page will be updated by the Service Worker that handles the notification.

### API
The API is built using API Gateway and AWS Lambda functions. The API facilitates fetching data for the website, saving subscriptions, logging when coffee is brewed, and sending subscriptions after a brew occurs.
