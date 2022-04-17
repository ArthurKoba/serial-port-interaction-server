export class FrequrencyGenerator {
  constructor (length) {
      this._length = length
      this._labels = []
      this._values = []
      this._harmonics = []
  }

  add_harmonic (mathFunc, frequrency, amplitude, offset = 0) {
    this._harmonics.push({mathFunc, frequrency, amplitude, offset})
  }

  generate (valueToResize = null) {
    if (!this._harmonics.length)
      throw new Error('Before need add_harmonic(). Template: object.add_harmonic(Math.sin, 1, 128)')
    for (let i = 0; i < this._length; i++) {
      this._values[i] = 0
      this._labels.push(i+1)
    }

    for (let i = 0; i < this._length; i++) {
        for (let harmonic of this._harmonics) {
          this._values[i] += Math.round(
              harmonic.mathFunc(i/harmonic.frequrency) *
              harmonic.amplitude/2 + harmonic.amplitude/2 + harmonic.offset
          )
        }
    }

    if (valueToResize) {

      let minValue = Math.min.apply(null, this._values)
      for (let i = 0; i < this._length; i++)
          this._values[i] -= minValue

      let maxValue = Math.max.apply(null, this._values)
      for (let i = 0; i < this._length; i++)
          this._values[i] = this._values[i]*valueToResize/maxValue
    }
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
