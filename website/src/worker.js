self.addEventListener('install', function (event) {
    // Perform install steps
});

self.addEventListener('push', function (event) {
    if (event.data) {
        console.log('This push event has data: ', event.data.text());
    } else {
        console.log('This push event has no data.');
    }

    const data = event.data.json();

    let { title, options } = data.notification;
    const notificationPromise = self.registration.showNotification(title, options);

    // Notify the webpage (if it's listening) that coffee
    // has just been brewed
    const postMessagePromise = new Promise((resolve, reject) => {
        self.clients.matchAll().then(function(clients) {
            clients.forEach(function(client) {
                client.postMessage(JSON.stringify(data.payload));
            });
        });
    });

    const promiseChain = Promise.all([
        notificationPromise,
        postMessagePromise
    ]);
    event.waitUntil(promiseChain);
});

self.addEventListener('message', function (e) {
    self.postMessage(e.data);
}, false);