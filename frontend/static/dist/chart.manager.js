class ManagedChart {
  _nodes = {}
  _isHided = true
  _isUpdatable = false

  constructor (chart, menuNotActiva) {
    this._chart = chart
    this.node = this._render(menuNotActiva)
  }

  _render(menuNotActiva) {
    this._nodes.base = document.createElement('div')
    this._nodes.base.classList.add('chart','col-6', 'p-0', 'd-none')

    this._nodes.container = document.createElement('div')
    this._nodes.container.classList.add('m-1', 'border', 'border-secondary', 'rounded')
    this._nodes.base.appendChild(this._nodes.container)

    this._nodes.chartContainer = document.createElement('div')
    this._nodes.chartContainer.classList.add('p-2')
    this._nodes.chartContainer.appendChild(this._chart.node)
    this._nodes.container.appendChild(this._nodes.chartContainer)

    if (!menuNotActiva) {
      this._nodes.resetButton = this._getButton("Reset Scales")
      this._nodes.fullScreenButton = this._getButton("Full Screen")
      this._nodes.resetButton.addEventListener('click', this._resetScales.bind(this))
      this._nodes.fullScreenButton.addEventListener('click', this.swapFullScreen.bind(this))
      this._nodes.menu = document.createElement('div')
      this._nodes.menu.classList.add(
          'd-flex', 'border-top', 'border-secondary', 'p-2',
          'input-group', 'input-group-sm', 'justify-content-center'
      )
      this._nodes.menu.appendChild(this._nodes.resetButton)
      this._nodes.menu.appendChild(this._nodes.fullScreenButton)
      this._nodes.container.appendChild(this._nodes.menu)
    }


    return this._nodes.base
  }

  _resetScales () {
    let scales = this._chart.config.options.scales.y
    scales.min = null
    scales.max = null
  }

  _getButton(text) {
    let button = document.createElement('button')
    button.classList.add('m-1', 'btn', 'input-group-sm', 'btn-outline-secondary')
    button.innerHTML = text
    return button
  }

  swapFullScreen() {
    this._nodes.base.classList.toggle('col-6')
    this._nodes.base.classList.toggle('col-12')
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
    this.isDeactiveMenus = false
    this.isAutoDeactivate = true
    this.isChartActualityLoopStarted = false
    this._loop().then(r => (r))

  }

  deactivateMenus() {
    this.isDeactiveMenus = true
  }

  createChart (chartClass, dataType , name) {
    let managerChart = new ManagedChart(new chartClass(name), this.isDeactiveMenus)

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
        if (!this.isAutoDeactivate)
          managedChart.hide()
      } else {
        managedChart.show()
      }
    }
  }

  async _loop (sleepTime = 200) {
    while (this.isChartActualityLoopStarted) {
      await (new Promise(res => setTimeout(res, sleepTime)))
      this.checkChartsActuality()
    }
  }
}
