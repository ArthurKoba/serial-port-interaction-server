import {ReloadWebsocket, SerialWebSocket} from './dist/websockets.js'
import {ChartManager} from './dist/chart.manager.js'
import {DefaultChart, FourierSeriesChart, BarSeriesChart} from './dist/chartsLibrary.js'

const serialWebSocket = new SerialWebSocket('ws://localhost/serial')
const chartManager = new ChartManager(serialWebSocket)

import {FFT} from './fft.js'
import {FrequencyGenerator} from './dist/utils.js'


class SamplesChart extends DefaultChart {}

class BrowserFFTChart extends FourierSeriesChart {
  convertData(labels, values) {
    let fftOut = FFT(values)
    return {labels: labels.slice(0, labels.length/2), values: fftOut}
  }
}

function main() {
  // chartManager.deactivateMenus()
  chartManager.serialWebSocket.debug = true
  chartManager.isAutoDeactivate = false
  chartManager.createChart(SamplesChart, 'samples', 'Samples')
  chartManager.createChart(BrowserFFTChart, 'samples', 'Browser FFT')

  const generator = new FrequencyGenerator(256)
  generator.addHarmonic(Math.sin, 10, 3)
  generator.addHarmonic(Math.sin, 0.5, 512)
  generator.addHarmonic(Math.sin, 5, 256)
  generator.addHarmonic(Math.sin, 5, 512)
  generator.addNoise(-64)
  generator.addLowLimit(0)
  generator.addHighLimit(1023)
  generator.addOffset(512)
  generator.addOffset(1)
  generator.generate()
  console.log(generator.values)

  const generatorChart = chartManager.createChart(SamplesChart, null, 'Generator')
  generatorChart.updateData(generator.values)

}

main()
