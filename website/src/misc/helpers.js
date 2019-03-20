/**
 * urlBase64ToUint8Array
 * 
 * @param {string} base64String a public vavid key
 */
function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export function checkRegistration() {
    return new Promise((resolve, reject) => {
        navigator.serviceWorker.getRegistration().then(registration => {
            if (registration) {
                registration.pushManager.getSubscription().then(sub => {
                    if (sub) {
                        console.log("Already subscribed");
                        console.log("Subscription: " + JSON.stringify(sub));
                        resolve(true);
                    }
                    else {
                        resolve(false);
                    }
                }).catch(err => {
                    resolve(false);
                });
            }
            else {
                resolve(false);
            }
        });
    })
}

/**
 * Determines if the browser has the serviceWorker and PushManager APIs
 * @returns {boolean} whether or not the browser is compatible
 */
function verifyCompatibility() {
    if (!('serviceWorker' in navigator)) {
        return false;
    }

    if (!('PushManager' in window)) {
        return false;
    }
    return true;
}

/**
 * Request permission from the user to send notifications
 * @returns {Promise<NotificationPermission>}
 */
function askPermission() {
    return new Promise(function (resolve, reject) {
        const permissionResult = Notification.requestPermission(function (result) {
            resolve(result);
        });

        if (permissionResult) {
            permissionResult.then(resolve, reject);
        }
    })
        .then(function (permissionResult) {
            if (permissionResult !== 'granted') {
                throw new Error('We weren\'t granted permission.');
            }
        });
}

/**
 * Registers the Service Worker with the browser
 * @returns {ServiceWorkerRegistration}
 */
function registerServiceWorker() {
    return navigator.serviceWorker.register('worker.bundle.js')
        .then(function (registration) {
            console.log('Service worker successfully registered.');
            return registration;
        })
        .catch(function (err) {
            console.error('Unable to register service worker.', err);
        });
}

// Need the polyfill to support async which adds >300 modules...
// Defaulting to promise-based execution
// async function subscribeUser() {
//     if (!verifyCompatibility())
//         return false;

//     await askPermission();
//     const subscribed = await checkRegistration();
//     const registration = await registerServiceWorker();

//     if (!subscribed) {
//         const subscribeOptions = {
//             userVisibleOnly: true,
//             applicationServerKey: urlBase64ToUint8Array(
//                 'BM5_LJu5BeWR5v7vmp0xJhZIReuxcp824H-JWaORrZLMqDzbq3WR5klUALW1qsf-I2I9hjiSLtsTFY9rkQniSs0'
//             )
//         };

//         const pushSubscription = await registration.pushManager.subscribe(subscribeOptions);
//         console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
//         return true;
//     }
//     else {
//         return true;
//     }
// }

export function subscribeUser() {
    return new Promise((resolve, reject) => {
        if (!verifyCompatibility()) {
            resolve(false);
        }

        askPermission().then(() => {
            checkRegistration().then(subscribed => {
                registerServiceWorker().then(registration => {
                    if (!subscribed) {
                        const subscribeOptions = {
                            userVisibleOnly: true,
                            applicationServerKey: urlBase64ToUint8Array(
                                'BM5_LJu5BeWR5v7vmp0xJhZIReuxcp824H-JWaORrZLMqDzbq3WR5klUALW1qsf-I2I9hjiSLtsTFY9rkQniSs0'
                            )
                        };

                        registration.pushManager.subscribe(subscribeOptions).then(pushSubscription => {
                            console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
                            resolve(true);
                        }).catch(err => {
                            reject(err);
                        });
                    }
                    else {
                        resolve(true);
                    }
                }).catch(err => {
                    reject(err);
                });
            }).catch(err => {
                reject(err);
            });
        }).catch(err => {
            reject(err);
        });
    });
}

export function unsubscribeUser() {
    return new Promise((resolve, reject) => {
        navigator.serviceWorker.getRegistration().then(registration => {
            if (registration) {
                registration.pushManager.getSubscription().then(pushSub => {
                    if (pushSub) {
                        pushSub.unsubscribe().then(res => {
                            if (!res)
                                reject("Unable to unsubscribe");
                            else {
                                console.log("PushSubscription unsubscribed.");
                                registration.unregister().then(regres => {
                                    if(!regres) {
                                        reject("Unable to unregister service worker");
                                    }
                                    else {
                                        console.log("Service worker unregistered.");
                                        resolve(true);
                                    }
                                })
                            }
                        })
                    }
                    else {
                        registration.unregister().then(res => {
                            if(!res) {
                                reject("Unable to unregister service worker");
                            }
                            else {
                                console.log("Service worker unregistered.");
                                resolve(true);
                            }
                        });
                    }
                });
            }
            else {
                resolve(true);
            }
        });
    })
}