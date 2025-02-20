import './index.css'

const NotFound = () => (
  <div className="not-found">
    <img
      src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
      alt="not found"
      className="not-found__image"
    />

    <h1 className="not-found__heading">Page Not Found</h1>
    <p className="not-found__description">
      we are sorry, the page you requested could not be found
    </p>
  </div>
)
export default NotFound
