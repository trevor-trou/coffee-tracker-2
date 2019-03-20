export class Stopwatch {
    constructor(ISOString, onChangeCallback, refDate) {
        this.increment = this.increment.bind(this);

        this.onChangeCallback = onChangeCallback;
        this.reset();
        this.setInitialTime(ISOString, refDate);
        this.start();
    }

    reset() {
        this.minutes = 0;
        this.seconds = 0;
        this.hours = 0;
        this.interval = null;
        this.incMin = false;
        this.incHour = false;
    }

    setInitialTime(ISOString, refDate) {
        if (!refDate)
            refDate = Date.now();
        let currentTime = refDate - (new Date(ISOString));
        this.hours = Math.floor(currentTime / 3600000); // 1000 * 60 * 60
        const diff = (currentTime / 60000) % 60;
        this.minutes = Math.floor(diff)
        this.seconds = Math.floor(60 * (diff - this.minutes));
    }

    start() {
        this.interval = setInterval(this.increment, 1000);
    }

    stop() {
        clearInterval(this.interval);
        this.interval = null;
    }

    report() {
        if(this.onChangeCallback) {
            this.onChangeCallback({
                hours: this.hours,
                minutes: this.minutes,
                seconds: this.seconds
            });
        }
    }

    increment() {
        if (this.incHour && this.incMin) {
            this.hours += 1;
            this.minutes = 0;
            this.seconds = 0;
        }
        else if(this.incMin) {
            this.minutes += 1;
            this.seconds = 0;
        }
        else {
            this.seconds += 1;
        }

        this.incMin = this.seconds === 59;
        this.incHour = this.minutes === 59;

        this.report();
    }
}