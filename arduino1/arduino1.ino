const int PIN[] = {12, 8, 9, 10, 11};
bool etat[5] = {0};

void setup() {

  for(int i = 0; i < 5; i++) pinMode(PIN[i], INPUT);

  Serial.begin(9600);

  delay(1000);

}

void loop() {

  for (int i = 0; i < sizeof(etat); i++){

    int btn = digitalRead(PIN[i]);  
  
    if (btn == HIGH && !etat[i]){
      
      etat[i] = true;
      
      Serial.println(i == 0 ? "@start" : "@press");
    
    }

  }

  if (Serial.available() != 0) {

    String request = Serial.readString();
    request.trim();
    
    if (request == "@reset") reset();

  }
    
}

void reset() {

  for (int j = 0; j < sizeof(etat); j++) {

    etat[j] = false;

  }

}