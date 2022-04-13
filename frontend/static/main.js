import {ReloadWebsocket, SerialWebSocket} from './dist/websockets.js'
import {ChartManager} from './dist/chart.manager.js'
import {DefaultChart, FourierSeriesChart} from './dist/chartsLibrary.js'

const serialWebSocket = new SerialWebSocket('ws://localhost/serial')
const chartManager = new ChartManager(serialWebSocket)

import {FFT} from './fft.js'


class SamplesChart extends DefaultChart {}

class BrowserFFTChart extends FourierSeriesChart {
  convertData(labels, values) {
    let fftOut = FFT(values)
    return {labels: labels.slice(0, labels.length/2), values: fftOut}
  }
}

function main(event) {
  chartManager.createChart(SamplesChart, 'samplesData', 'Samples')
  chartManager.createChart(BrowserFFTChart, 'samplesData', 'Browser FFT')
  chartManager.createChart(FourierSeriesChart, 'fhtData', 'Arduino FHT')

  const samplesChart = chartManager.createChart(SamplesChart, null, 'Samples Data')
  samplesChart.updateData(values)
  const browserFFTChart = chartManager.createChart(BrowserFFTChart, null, 'Browser FFT')
  browserFFTChart.updateData(values)
}

main()
