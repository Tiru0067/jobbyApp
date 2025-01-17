import './index.css'

const JobFailure = ({onRetry}) => (
  <div className="job-failure-container">
    <img
      src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
      alt="failure view"
      className="error-image"
    />
    <h1 className="error-heading">Oops! Something Went Wrong</h1>
    <p className="error-message">
      We cannot seem to find the page you are looking for.
    </p>
    <button type="button" className="retry-button" onClick={onRetry}>
      Retry
    </button>
  </div>
)
export default JobFailure
