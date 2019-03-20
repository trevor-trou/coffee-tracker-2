self.addEventListener('install', function (event) {
    // Perform install steps
});

self.addEventListener('push', function (event) {
    if (event.data) {
        console.log('This push event has data: ', event.data.text());
    } else {
        console.log('This push event has no data.');
    }
    let { title, options } = event.data.json();
    const promiseChain = self.registration.showNotification(title, options);

    event.waitUntil(promiseChain);
});