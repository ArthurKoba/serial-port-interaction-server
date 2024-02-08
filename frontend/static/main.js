import {ReloadWebsocket, SerialWebSocket} from './dist/websockets.js'
import {ChartManager} from './dist/chart.manager.js'
import {DefaultChart, FourierSeriesChart, FourierWithFreqSeriesChart, BarSeriesChart} from './dist/chartsLibrary.js'

const serialWebSocket = new SerialWebSocket('ws://localhost/serial')
const chartManager = new ChartManager(serialWebSocket)

import {FFT} from './fft.js'
import {FrequencyGenerator} from './dist/utils.js'


class SamplesChart extends DefaultChart {
  initConfigs() {
    // this.config.options.elements.line.cubicInterpolationMode = 'monotone'
    this.config.options.elements.line.cubicInterpolationMode = 'default'
    this.config.options.elements.line.borderColor = "rgba(0, 0, 0, 1)"
    this.config.options.scales.y.ticks = {callback: value => `${
      Math.round(value * 100) / 100
    } В`}
    this.config.options.scales.y.min = -3
    this.config.options.scales.y.max = 3
    // this.config.options.scales.y.min = 1

    // this.config.options.elements.line.fill = true
  }
}

class SamplesChart2 extends DefaultChart {
  initConfigs() {
    // this.config.options.elements.line.cubicInterpolationMode = 'monotone'
    this.config.options.elements.line.cubicInterpolationMode = 'default'
    this.config.options.elements.line.borderColor = "rgba(0, 0, 0, 1)"
    this.config.options.scales.y.ticks = {callback: value => `${
      Math.round(value * 100) / 100
    } В`}
    this.config.options.scales.y.min = -1
    this.config.options.scales.y.max = 6
    // this.config.options.scales.y.min = 1

    // this.config.options.elements.line.fill = true
  }
}

class BrowserFFTChart extends FourierSeriesChart {
  convertData(labels, values) {
    let fftOut = FFT(values)
    return {labels: labels.slice(0, labels.length/2), values: fftOut}
  }
}

class Plotter extends DefaultChart {
  initConfigs() {
    this.kickValues = []
    this.highValues = []
    // this.config.options.elements.line.cubicInterpolationMode = 'monotone'
    // this.config.options.elements.line.cubicInterpolationMode = 'default'
    // this.config.options.elements.line.fill = true
  }

  _updateData (labels, values) {
    let convertData = this.convertData(labels, values)
    labels = convertData.labels
    values = convertData.values
    this.lastUpdate = performance.now()
    this.dataLength = values.length
    this.setMinAndMaxValue(0, 255)

    let kickValue = values[8]
    this.kickValues.push(kickValue)

    let highValue = 0
    for (let i = Number.parseInt(values.length*2/3); i < values.length; i++) {
      if (values[i] > highValue) highValue = values[i]
    }

    this.highValues.push(highValue)
    if (this.kickValues.length > labels.length) this.kickValues.shift()
    if (this.highValues.length > labels.length) this.highValues.shift()

    this._chart.config.data.labels = labels
    this._chart.config.data.datasets = [
      {data: this.kickValues, borderColor: "#F00"},
      {data: this.highValues, borderColor: "#00F"}
    ]
    this._chart.update('none')
  }
}

function genGeneratorChars() {
  const generator = new FrequencyGenerator(256)
  let amplitude = 5
  generator.addHarmonic(Math.sin, 7, amplitude)
  // generator.addHarmonic(Math.sin, 0.5, 2500)
  // generator.addNoise(-64)
  // generator.addLowLimit(0)
  // generator.addHighLimit(1000)
  generator.addOffset(-amplitude/2)
  // generator.addOffset(1)
  generator.generate()
  console.log(generator.values)

  const generatorChart = chartManager.createChart(SamplesChart, null, 'Реальные значения сигнала')
  generatorChart.updateData(generator.values)
}

function genGeneratorChars2() {
  const generator = new FrequencyGenerator(256)
  let amplitude = 5
  generator.addHarmonic(Math.sin, 7, amplitude)
  // generator.addHarmonic(Math.sin, 0.5, 2500)
  // generator.addNoise(-64)
  generator.addLowLimit(0)
  // generator.addHighLimit(1000)
  generator.addOffset(-amplitude/2)
  generator.generate()
  console.log(generator.values)

  const generatorChart = chartManager.createChart(SamplesChart2, null, 'Значения с микроконтроллера')
  generatorChart.updateData(generator.values)
}


function generateBarkScaleTable(amplitudeSize, samplingFrequency) {
  var data = []
  let freqStep = 1/(amplitudeSize*2/samplingFrequency)
  for (let i = 0; i < amplitudeSize; i++) {
    let base = i * freqStep/650
    data[i] = 7.0 * Math.log(base + Math.sqrt(1 + base * base))
  }
  for (let i = 1; i < amplitudeSize; i++) data[i] = data[i]/data[amplitudeSize-1]
  return data
}

function generateTestBarkScaleTable(amplitudeSize, samplingFrequency) {
  var data = []
  let freqStep = 1/(amplitudeSize*2/samplingFrequency)
  for (let i = 0; i < amplitudeSize; i++) {
    let base = i * freqStep/3000
    data[i] =  Math.log(base + Math.sqrt(1 + base * base))
  }
  // for (let i = 1; i < amplitudeSize; i++) data[i] = 0.001 + data[i]/data[amplitudeSize-1]
  return data
}

function testBarkScale() {
  var amplitudeSize = 1024
  var samplingFrequency = 44100
  const chart1 = chartManager.createChart(FourierWithFreqSeriesChart, null, 'Bark Scale')
  const chart2 = chartManager.createChart(FourierWithFreqSeriesChart, null, 'Test Bark Scale')
  chart1.getChart().setSamplesSize(2048)
  chart1.updateData(generateBarkScaleTable(amplitudeSize, samplingFrequency))
  chart2.getChart().setSamplesSize(2048)
  chart2.updateData(generateTestBarkScaleTable(amplitudeSize, samplingFrequency))

}

function main() {
  chartManager.deactivateMenus()
  chartManager.serialWebSocket.debug = true
  chartManager.isAutoDeactivate = false
  // chartManager.isDefaultFullscreen = true
  // chartManager.createChart(SamplesChart, 'samples', 'Samples')
  genGeneratorChars()
  genGeneratorChars2()
  // chartManager.createChart(BarSeriesChart, 'fft', 'Samples')
  // chartManager.createChart(BrowserFFTChart, 'samples', 'Browser FFT')
  // chartManager.createChart(BarSeriesChart, 'window', 'Window')
  // chartManager.createChart(BarSeriesChart, 'bark', 'Bark')
  // const testChart = chartManager.createChart(FourierWithFreqSeriesChart, 'fft', 'FFT MICROCONTROLLER')
  // const plotter = chartManager.createChart(Plotter, 'fft', "Plotter")
  // testChart.getChart().setSamplesSize(1024)
  // chartManager.createChart(BarSeriesChart, 'info', 'fft calc | ws2812 show | send time | fft area | ')
  // testBarkScale()

}

main()
