class DarkModeSwaper {
  constructor () {
    this._swapButton = document.querySelector('.dark-mode-swaper i')
    // this.darkMode = document.body.classList.contains("dark-mode")

    this._initDarkMode()
    this._swapButton.parentNode
                  .addEventListener('click', this.darkModeHandler.bind(this))

  }
  _initDarkMode () {
    this.darkMode = JSON.parse(localStorage.getItem('darkMode'))
    if (this.darkMode === null) {
      this.darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
      localStorage.setItem('darkMode', this.darkMode)
    }
    if (this.darkMode !== document.body.classList.contains('dark-mode')) { this._swap() }
  }

  _swap () {
    document.body.classList.toggle("dark-mode")
    this._swapButton.classList.toggle("fa-sun")
    this._swapButton.classList.toggle("fa-moon")
  }

  darkModeHandler() {
    this._swap()
    this.darkMode = !this.darkMode
    localStorage.setItem('darkMode', this.darkMode)
  }
}

function main() { new DarkModeSwaper() }
document.addEventListener('DOMContentLoaded', main)
