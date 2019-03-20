export class Stopwatch {
    constructor(onChangeCallback, refDate) {
        this.increment = this.increment.bind(this);
        this.restart = this.restart.bind(this);

        this.onChangeCallback = onChangeCallback;
    }

    reset() {
        this.minutes = 0;
        this.seconds = 0;
        this.hours = 0;
        this.interval = null;
        this.incMin = false;
        this.incHour = false;
    }

    restart(ISOString) {
        if (ISOString) {
            this.stop();
            this.reset();
            this.setInitialTime(ISOString);
            this.start();
        }

        return {
            hours: this.hours,
            minutes: this.minutes,
            seconds: this.seconds
        };
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
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    report() {
        if (this.onChangeCallback) {
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
        else if (this.incMin) {
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