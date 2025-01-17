import {Redirect} from 'react-router-dom'
import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', showSubmitError: false, errorMsg: ''}

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    console.log(errorMsg)
    this.setState({showSubmitError: true, errorMsg})
  }

  fetchLoginDetails = async () => {
    const {username, password} = this.state
    const options = {
      method: 'POST',
      body: JSON.stringify({username, password}),
    }

    const response = await fetch('https://apis.ccbp.in/login', options)
    console.log(response)
    const data = await response.json()
    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  handleUsernameChange = event => {
    this.setState({username: event.target.value})
  }

  handlePasswordChange = event => {
    this.setState({password: event.target.value})
  }

  handleSubmit = event => {
    event.preventDefault()
    this.fetchLoginDetails()
  }

  render() {
    const {username, password, showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login">
        <div className="login__container">
          <img
            className="login__logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
          <form className="login__form" onSubmit={this.handleSubmit}>
            <div className="login__form-group">
              <label htmlFor="username" className="login__label">
                USERNAME
              </label>
              <input
                id="username"
                className="login__input"
                type="text"
                placeholder="Username"
                value={username}
                onChange={this.handleUsernameChange}
              />
            </div>
            <div className="login__form-group">
              <label htmlFor="password" className="login__label">
                PASSWORD
              </label>
              <input
                id="password"
                className="login__input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={this.handlePasswordChange}
              />
            </div>
            <button type="submit" className="login__button">
              Login
            </button>
            {/* Error message */}
            {showSubmitError && (
              <p className="login__error-message">*{errorMsg}</p>
            )}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
