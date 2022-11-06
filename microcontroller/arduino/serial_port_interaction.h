void _send_data_type(String data_type) {
  Serial.print(F("{\"dataType\":\""));
  Serial.print(data_type);
  Serial.print(F("\",\"data\":"));
}

void send_json_array(uint8_t *arr, const uint16_t arr_size, String data_type = "null") {
  _send_data_type(data_type);
  Serial.print("[" + String(arr[0]));
  for (uint16_t i = 1; i < arr_size;) Serial.print("," + String(arr[i++]));
  Serial.println(F("]}"));
}

void send_json_array(int16_t *arr, const uint16_t arr_size, String data_type = "null") {
  _send_data_type(data_type);
  Serial.print("[" + String(arr[0]));
  for (uint16_t i = 1; i < arr_size;) Serial.print("," + String(arr[i++]));
  Serial.println(F("]}"));
}