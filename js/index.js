import { rgba2hex, copyToClipboard } from "./utils.js"

const colorPickForm = document.getElementById('color-pick-form')
const cardBottom = document.getElementById('card-bottom')

let colors = []

colorPickForm.addEventListener('submit', handleFormSubmission)
cardBottom.addEventListener('click', (e) => {
  clearPreviousCopiedText()

  if (e.target.classList.contains('color')) {
    copyToClipboard(rgba2hex(e.target.style.backgroundColor))
    e.target.textContent = "Copied"
  }
  if (e.target.classList.contains('hexVal')) {
    copyToClipboard(e.target.textContent)
    e.target.textContent += "✅"
  }
})

function clearPreviousCopiedText() {
  document.querySelectorAll('.color').forEach((color) => color.textContent = '')
  document.querySelectorAll('.hexVal').forEach((hexVal) => {
    if (hexVal.textContent[hexVal.textContent.length - 1] === '✅') {
      hexVal.textContent = hexVal.textContent.slice(0, -1)
    }
  })
}

function handleFormSubmission(e) {
  e.preventDefault()

  const colorPickFormData = new FormData(colorPickForm)

  const colorHexClean = colorPickFormData.get('input-color').substring(1)
  const mode = colorPickFormData.get('input-color-mode')

  getColorScheme(colorHexClean, mode)
}

function getColorScheme(colorHexClean, mode) {
  fetch(`https://www.thecolorapi.com/scheme?hex=${colorHexClean}&mode=${mode}&count=5`)
  .then(response => response.json())
  .then(data => {
    colors = []
    for(let color of data.colors) {
      colors.push(color.hex)
    }
    render()
  })
}

function render() {
  let colorsDom = ""

  for(let i = 0; i < colors.length; i++) {
    colorsDom += `
      <div class="color color${i+1}"tabindex="1" style="background-color: ${colors[i].value};"></div>
      <div class="hexVal">${colors[i].value}</div>
    `
  }

  document.getElementById('card-bottom').innerHTML = colorsDom
}

getColorScheme(document.getElementById('input-color').value.substring(1), 'monochrome')