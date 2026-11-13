import { showAlert } from './alert.js'

const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    })
    if (res.data.status === 'success') {
      location.assign('/')
    }
  } catch (err) {
    showAlert('error', 'Error logging out! Try again.')
  }
}

const el = document.querySelector('.nav--user')

const renderLoggedOut = () => {
  const login = document.createElement('a')
  login.className = 'nav__el nav__el--cta'
  login.href = '/login'
  login.textContent = 'Log in'

  const signup = document.createElement('a')
  signup.className = 'nav__el nav__el--cta'
  signup.href = '/signup'
  signup.textContent = 'Sign up'

  el.replaceChildren(login, signup)
}

const renderLoggedIn = (user) => {
  const logoutLink = document.createElement('a')
  logoutLink.className = 'nav__el'
  logoutLink.href = '#'
  logoutLink.textContent = 'Log out'
  logoutLink.addEventListener('click', (event) => {
    event.preventDefault()
    logout()
  })

  const profile = document.createElement('a')
  profile.className = 'nav__el'
  profile.href = '/me'

  const photo = document.createElement('img')
  photo.className = 'nav__user-img'
  photo.alt = 'User profile'
  photo.src = `/img/users/${encodeURIComponent(user.photo || 'default.jpg')}`

  const name = document.createElement('span')
  name.textContent = user.name

  profile.append(photo, name)
  el.replaceChildren(logoutLink, profile)
}

axios
  .get('/api/v1/users/me')
  .then((res) => renderLoggedIn(res.data.data.user))
  .catch(renderLoggedOut)