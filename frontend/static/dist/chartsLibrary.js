export class DefaultChart {

  lastUpdate = performance.now()

  config = {
    type: 'line', data: {},
    options: {
      radius: 0,
      responsive: true,
      plugins: {
        legend: false, title: {
          display: true, text: 'Chart'
        }
      },
      elements: {
        bar: {},
        line: {
          borderColor: "rgba(0, 255, 0, 1)",
          borderWidth: 1
        }},
      scales: {y: {}, x: {}}
    }
  }

  constructor (chartName = null) {
    this.initConfigs()
    if (chartName) this.config.options.plugins.title.text= chartName
    this.node = document.createElement('canvas')
    this._chart = new Chart(this.node, this.config)
  }

  initConfigs () { }

  _updateData (labels, values) {
    let convertData = this.convertData(labels, values)
    labels = convertData.labels
    values = convertData.values
    this.lastUpdate = performance.now()
    this.dataLength = values.length
    this.setMinAndMaxValue(
      Math.min.apply(null, values),
      Math.max.apply(null, values)
    )
    this._chart.config.data.labels = labels
    this._chart.config.data.datasets = [{data: values}]
    this._chart.update('none')
  }

  dataHandler(data) {
    let labels = []
    let values = []

    for (let index = 0; index < data.length; index++) {
      labels.push(index+1)
      values.push(data[index])
    }
    this._updateData(labels, values)
  }

  setMinAndMaxValue(min, max) {
    if (!this.config.options.scales.y.min || this.config.options.scales.y.min > min)
      this.config.options.scales.y.min = min

    if (!this.config.options.scales.y.max || this.config.options.scales.y.max < max)
      this.config.options.scales.y.max = max
  }

  convertData (labels, values) {
    return {labels: labels, values: values}
  }

}

export class FourierSeriesChart extends DefaultChart {
  initConfigs () {
    this.config.type = "bar"
    this.config.options.elements.bar.backgroundColor = this.getColor.bind(this)
  }

  getColor(context) {
    if (context.index < this.dataLength/3) return "rgba(255, 0, 0, 1)"
    else if (context.index < this.dataLength*2/3) return "rgba(0, 255, 0, 1)"
    else if (context.index < this.dataLength) return "rgba(0, 0, 255, 1)"
    else return "rgba(0, 0, 0, 1)"
  }
}
