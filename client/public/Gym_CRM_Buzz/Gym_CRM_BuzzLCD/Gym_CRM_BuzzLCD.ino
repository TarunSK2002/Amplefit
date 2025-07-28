#include <Wire.h>
#include <LiquidCrystal_I2C.h>

#define BUZZER_PIN 8

// Change the address 0x27 to 0x3F if needed
LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  Serial.begin(9600);
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);

  lcd.init();
  lcd.backlight();
  showReadingMessage(); // Show initial message
}

void loop() {
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');
    command.trim(); // remove newline and spaces

    if (command == "BUZZ_ON") {
      buzz(2000);
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Access Denied");
      lcd.setCursor(0, 1);
      lcd.print("Contact Trainer");
      Serial.println("Access Denied. Contact Trainer for your Access");
      delay(3000); // show the message for 3 seconds
      showReadingMessage();
    }
    else if (command == "BUZZ_OFF") {
      // buzz(200);
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("   Start Your");
      lcd.setCursor(0, 1);
      lcd.print("    Workout");
      Serial.println("Attendance Marked");
      delay(2000); // show the message for 2 seconds
      showReadingMessage();
    }
    else {
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Unknown Cmd");
      Serial.println("Unknown command");
      delay(2000); // brief pause before returning
      showReadingMessage();
    }
  }
}

void buzz(int durationMs) {
  digitalWrite(BUZZER_PIN, HIGH);
  delay(durationMs);
  digitalWrite(BUZZER_PIN, LOW);
}

void showReadingMessage() {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Reading...");
}
