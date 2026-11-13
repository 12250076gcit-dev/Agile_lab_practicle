export const hideAlert = () => {
  const el = document.querySelector('.alert')
  if (el) el.parentElement.removeChild(el)
}

// type is 'success' or 'error'
export const showAlert = (type, msg) => {
  hideAlert()

  const alert = document.createElement('div')
  alert.classList.add('alert', `alert--${type}`)
  alert.textContent = msg
  document.body.prepend(alert)

  window.setTimeout(() => alert.remove(), 5000)
}