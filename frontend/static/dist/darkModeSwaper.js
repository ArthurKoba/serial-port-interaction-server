class DarkModeSwaper {
  constructor () {
    this._swapButton = document.querySelector('.dark-mode-swaper i')
    this._swapButton.parentNode
                  .addEventListener('click', this.swap.bind(this))
  }


  swap () {
    document.body.classList.toggle("dark-mode")
    this._swapButton.classList.toggle("fa-sun")
    this._swapButton.classList.toggle("fa-moon")
    
  }
}

function main() { new DarkModeSwaper() }
document.addEventListener('DOMContentLoaded', main)
