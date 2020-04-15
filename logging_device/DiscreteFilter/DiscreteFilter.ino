#include <TimerOne.h>
unsigned long delayCount;
unsigned long numberOfSamples;
float y;
float y2;
float yNeg1;
float yNeg2;
float xNeg1;
float xNeg2;
float x;
float threshold;
bool changed;
float offset;

//int yThresh [5];
int yThresh;

unsigned long overArchingTimer;
unsigned long renewalTimer;
unsigned long timeSinceLastBeep;
unsigned int beepCount;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);

  Timer1.initialize(250); // set a timer of length 100000 microseconds (or 0.1 sec - or 10Hz => the led will blink 5 times, 5 cycles of on-and-off, per second)
  Timer1.attachInterrupt( timerIsr ); // attach the service routine here
  
  yNeg1 = 0;
  yNeg2 = 0;
  xNeg1 = 0;
  xNeg2 = 0;
  x = 0;
  y = 0;
  y2 = 0;

  threshold = 19; //59

  //for(int i = 0; i < 5; i++) {
  //  yThresh[i] = 0;
  //}
  yThresh = 0;
  timeSinceLastBeep = 0;
  beepCount = 0;
  changed = true;

  pinMode(6, OUTPUT);
  pinMode(7, OUTPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  //Serial.println("In Loop");
  //numberOfSamples = 0;
  //delayCount = millis();
  //while(millis() - delayCount < 1000) {
    //Serial.println("In delay");
  //}
  //Serial.println(numberOfSamples);

    // Stage 4 - Match Beep Pattern
 
   if(yThresh == 1 && changed) {
    changed = false;
    if(micros() - renewalTimer > 12000) {
      renewalTimer = micros();
      overArchingTimer = millis();
      //Serial.println("Restarting Renewal");
      digitalWrite(6, LOW);
    }
    else {
      if(millis() - overArchingTimer > 290)  //400 // I think we're running into issues when the timers overflow
      {
        delay(50);
        unsigned long timeSince = millis() - timeSinceLastBeep;
        Serial.println("I heard a beep! "  + (String)timeSince + "s since last beep.");
        digitalWrite(6, HIGH);
        int timedelay = millis() - timeSinceLastBeep;
        if(timedelay < 1220 && timedelay > 600) { //1500 500 // <- was 650
          beepCount++;
          if(beepCount > 2) {
            Serial.println("Logging Coffee");
            beepCount = 0;
            digitalWrite(7, HIGH);
            delay(2000);
            digitalWrite(7, LOW);
          }
        }
        else if(timedelay > 340 && timedelay < 360) {
          Serial.println("Misfire");
        }
        else {
          //Serial.println("Resetting Beep Count... ");
          beepCount = 0;
        }
        timeSinceLastBeep = millis();
        overArchingTimer = millis();
      }
      renewalTimer = micros();
    }
  }
}

void timerIsr()
{
  // Stage 1 - Bandpass filter
  yNeg2 = yNeg1;
  yNeg1 = y;
  xNeg2 = xNeg1;
  xNeg1 = x;
  x = analogRead(A0) - 255;
  // y = 0.00995*x - 0.00995*xNeg2 + 1.98*yNeg1 - 0.9801*yNeg2; //- 0.999*xNeg1
  y = 0.5*x - 0.999*xNeg1 + 0.5*xNeg2 + 1.98*yNeg1 - .9801*yNeg2;
  //Serial.println(y);
  y2 = y + 113.0;
  //  y2 = y;
  //Serial.println(y2);
  // Stage 2 - Averaging filter (Can't implement, due to hardware limitations)

  // Actual Stage 2 - Absolute Value And Threshold

  // Move Previous Threshold Values
  // for(int i = 5; i > 0; i--) {
  //  yThresh[i] = yThresh[i-1];
  //}
  
  if(y2 < 0)
  {
    // Stage 3, Threshold
    if(-y2 > threshold)
    {
      yThresh = 1;
    }
    else
    {
      yThresh = 0;
    }
  }
  else
  {
    // Stage 3, Threshold
    if(y2 > threshold)
    {
      yThresh = 1;
    }
    else
    {
      yThresh = 0;
    }
  }
  //Serial.println(yThresh);
  changed = true;
  // Stage 3 - Count Previous above Threshold
  //int aboveThresh = 0;
  //for(int i = 0; i < 5; i++) {
  //  if(yThresh[i] == 1) {
  //    aboveThresh++;
  //  }
  //}
  //if(aboveThresh > 3) {
  //  Serial.println(1);
  //}
  //else {
  //  Serial.println(0);
  //}
  //Serial.println(y);
  //numberOfSamples++;
}

