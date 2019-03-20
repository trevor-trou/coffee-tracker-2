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