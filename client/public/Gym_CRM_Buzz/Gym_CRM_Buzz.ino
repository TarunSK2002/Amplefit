#define BUZZER_PIN 8  // You can change this pin as needed

void setup() {
  Serial.begin(9600);         // Start serial communication
  pinMode(BUZZER_PIN, OUTPUT); // Set buzzer pin as output
  digitalWrite(BUZZER_PIN, LOW); // Ensure buzzer is off
}

void loop() {
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');
    command.trim(); // remove any trailing newline or spaces

    if (command == "BUZZ_ON") {
      buzz(2000);  // Buzz for 2 seconds
      Serial.println("Buzzed for 2 seconds");
    }
    else if (command == "BUZZ_OFF") {
      buzz(200);   // Buzz shortly for 200 milliseconds
      Serial.println("Short buzzed");
    }
    else {
      Serial.println("Unknown command");
    }
  }
}

void buzz(int durationMs) {
  digitalWrite(BUZZER_PIN, HIGH);
  delay(durationMs);
  digitalWrite(BUZZER_PIN, LOW);
}
