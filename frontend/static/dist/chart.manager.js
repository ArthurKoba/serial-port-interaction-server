class ManagedChart {
  _nodes = {}
  _isHided = true
  _isUpdatable = false

  constructor (chart) {
    this._chart = chart
    this.node = this._render()
  }

  _render() {
    let node = document.createElement('div')
    node.classList.add('chart', 'col-6', 'p-2', 'd-none')
    this._nodes.title = document.createElement('div')
    this._nodes.title.classList.add('title', 'text-center')
    node.appendChild(this._nodes.title)
    node.appendChild(this._chart.node)
    this._nodes.menu = document.createElement('div')
    this._nodes.menu.classList.add('d-flex')

    this._nodes.resetMenu = document.createElement('div')
    this._nodes.resetMenu.classList.add('input-group', 'input-group-sm', 'justify-content-center')
    this._nodes.resetButton = document.createElement('button')
    this._nodes.resetButton.classList.add('btn', 'input-group-sm')
    this._nodes.resetButton.innerHTML = "Reset Scales"


    this._nodes.resetMenu.appendChild(this._nodes.resetButton)
    this._nodes.resetButton.addEventListener('click', this._resetScales.bind(this))
    this._nodes.menu.appendChild(this._nodes.resetMenu)


    node.appendChild(this._nodes.menu)
    return node
  }

  _resetScales (event) {
    let scales = this._chart.config.options.scales.y
    scales.min = null
    scales.max = null
  }

  show () {
    if (!this._isHided) return
    this.node.classList.remove('d-none')
    this._isHided = false
  }

  hide () {
    if (this._isHided) return
    this.node.classList.add('d-none')
    this._isHided = true
  }

  updateData(values) { this._chart.dataHandler(values) }
}

export class ChartManager {
  charts = []

  constructor (serialWebSocket) {
    this.serialWebSocket = serialWebSocket
    this.node = document.getElementById("charts")
    this.startChartsActualityLoop()
  }

  createChart (chartClass, dataType , name) {
    let managerChart = new ManagedChart(new chartClass(name))

    if (dataType) {
      this.serialWebSocket.registerHandlerObject(dataType, managerChart._chart)
      managerChart._isUpdatable = true
    }
    this.charts.push(managerChart)
    this.node.appendChild(managerChart.node)
    return managerChart
  }

  checkChartsActuality() {
    for (let managedChart of this.charts) {
      if (managedChart._isUpdatable && managedChart._chart.lastUpdate < performance.now() - 200) {
        managedChart.hide()
      } else {
        managedChart.show()
      }
    }
  }

  async startChartsActualityLoop (sleepTime = 200) {
    while (true) {
      await (new Promise(res => setTimeout(res, sleepTime)))
      this.checkChartsActuality()
    }
  }
}
