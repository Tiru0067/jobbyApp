import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillHome} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <header className="app-header">
      <Link to="/">
        <img
          className="app-header__logo"
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
        />
      </Link>

      {/* Desktop Navigation */}
      <nav className="app-header__navbar desktop-navbar">
        <ul className="app-header__menu">
          <li className="app-header__menu-item">
            <Link to="/">Home</Link>
          </li>
          <li className="app-header__menu-item">
            <Link to="/jobs">Jobs</Link>
          </li>
        </ul>
      </nav>

      {/* Mobile Navigation */}
      <nav className="app-header__navbar mobile-navbar">
        <ul className="app-header__menu">
          <li className="app-header__menu-item">
            <Link to="/">
              <AiFillHome className="app-header__icon" />
            </Link>
          </li>
          <li className="app-header__menu-item">
            <Link to="/jobs">
              <BsFillBriefcaseFill className="app-header__icon" />
            </Link>
          </li>
        </ul>
      </nav>

      <button
        type="button"
        className="app-header__logout-button mobile-logout-button"
        onClick={onClickLogout}
      >
        <FiLogOut className="app-header__icon" />
      </button>
      <button
        type="button"
        className="app-header__logout-button desktop-logout-button"
        onClick={onClickLogout}
      >
        Logout
      </button>
    </header>
  )
}
export default withRouter(Header)
