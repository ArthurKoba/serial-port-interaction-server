#include "serial_port_interaction.h"

void setup() {
  Serial.begin(500000);
}

uint8_t samples_generator_offset = 0;

const int16_t samples_length = 64;
int16_t samples[samples_length];


void generate_samples(uint8_t &offset, int16_t *samples, int16_t samples_length) {

  for (int index = 0; index < samples_length; index++) {
    double freq = index + offset;
    double value = sin(freq) * 100;
    samples[index] = round(value);
  }
  offset++;
}

void loop() {
  generate_samples(samples_generator_offset, samples, samples_length);
  send_json_array(samples, samples_length, "samples");
}
