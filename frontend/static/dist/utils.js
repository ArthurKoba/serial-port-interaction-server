export class FrequencyGenerator {
  constructor (length) {
      this._length = length
      this._labels = []
      this._values = []
      this._harmonics = []
      this._noises = []
      this._offset = null
      this._lowLimit = null
      this._highLimit = null
  }

  addOffset(value) {
    this._offset = value
  }

  addHarmonic (mathFunc, frequency, amplitude) {
    this._harmonics.push({mathFunc, frequency: frequency, amplitude: amplitude/2})
  }

  addNoise (amplitude) {
    this._noises.push(amplitude)
  }

  addLowLimit (value) {
    this._lowLimit = value
  }

  addHighLimit (value) {
    this._highLimit = value
  }

  generate (isRound = false) {
    if (!this._harmonics.length)
      throw new Error('Before need add_harmonic(). Template: object.add_harmonic(Math.sin, 1, 128)')

    let offset = this._offset !== null ? this._offset : 0

    for (let i = 0; i < this._length; i++) {

      this._values[i] = 0
      this._labels.push(i + 1)

      for (let harmonic of this._harmonics) {
        let harmonicCoefficient = harmonic.mathFunc(i / harmonic.frequency)
        this._values[i] +=  harmonicCoefficient * harmonic.amplitude + harmonic.amplitude
      }

      for (let noiseLevel of this._noises) {
        this._values[i] += Math.random() * noiseLevel - noiseLevel
      }

      this._values[i] += offset

      if (isRound) this._values[i] = Math.round(this._values[i])

      if (this._lowLimit !== null && this._values[i] < this._lowLimit) {
        this._values[i] = this._lowLimit
      }

      if (this._highLimit !== null && this._values[i] > this._highLimit) {
        this._values[i] = this._highLimit
      }
    }

    // if (valueToResize) {
    //
    //   let minValue = Math.min.apply(null, this._values)
    //   for (let i = 0; i < this._length; i++)
    //       this._values[i] -= minValue
    //
    //   let maxValue = Math.max.apply(null, this._values)
    //   for (let i = 0; i < this._length; i++)
    //       this._values[i] = this._values[i]*valueToResize/maxValue
    // }
  }

  get labels() {
    if (!this._labels.length)
      throw new Error('Before need use generate()')
    return this._labels
  }

  get values() {
    if (!this._values.length)
      throw new Error('Before need use generate()')
    return this._values
  }
}
