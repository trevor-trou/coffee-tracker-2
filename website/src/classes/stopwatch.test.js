import { Stopwatch } from "./stopwatch";

test("stopwatch initializes correctly", () => {
    const oneHour = 1000 * 60 * 60;
    const oneMinute = 1000 * 60;
    const oneSecond = 1000;

    let currentTime = new Date();
    // Adding an additional millisecond to help avoid any rounding errors
    let pastTime = new Date(currentTime - (oneHour + oneMinute + oneSecond + 1));
    
    let stopwatch = new Stopwatch(pastTime.toISOString(), null, currentTime);

    expect(stopwatch.hours).toBe(1);
    expect(stopwatch.minutes).toBe(1);
    expect(stopwatch.seconds).toBe(1);
});

test("stopwatch rolls over seconds", () => {
    let stopwatch = new Stopwatch((new Date()).toISOString());
    stopwatch.hours = 0;
    stopwatch.minutes = 0;
    stopwatch.seconds = 58;

    stopwatch.increment();
    stopwatch.increment();
    
    expect(stopwatch.minutes).toBe(1);
    expect(stopwatch.seconds).toBe(0);
});

test("stopwatch rolls over minutes", () => {
    let stopwatch = new Stopwatch((new Date()).toISOString());
    stopwatch.hours = 0;
    stopwatch.minutes = 58;
    stopwatch.seconds = 58;

    for(let i = 0; i < 62; i++) {
        stopwatch.increment();
    }

    expect(stopwatch.hours).toBe(1);
    expect(stopwatch.minutes).toBe(0);
    expect(stopwatch.seconds).toBe(0);
});