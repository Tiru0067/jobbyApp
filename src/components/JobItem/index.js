import {Link} from 'react-router-dom'
import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import './index.css'

const JobItem = ({jobDetails}) => {
  const {
    id,
    title,
    job_description: jobDescription,
    package_per_annum: packagePerAnnum,
    company_logo_url: companyLogoUrl,
    employment_type: employmentType,
    location,
    rating,
  } = jobDetails

  return (
    <Link to={`/jobs/${id}`} className="job-item__link">
      <li className="job-item">
        <div className="company-info">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div className="job-title-rating">
            <h1 className="job-title">{title}</h1>
            <div className="rating">
              <FaStar className="rating-icon" />
              <p className="rating-value">{rating}</p>
            </div>
          </div>
        </div>
        <div className="job-details">
          <div className="location">
            <MdLocationOn className="location-icon" />
            <p className="location-text">{location}</p>
          </div>
          <div className="employment-type">
            <BsFillBriefcaseFill className="employment-icon" />
            <p className="employment-text">{employmentType}</p>
          </div>
          <p className="package">{packagePerAnnum}</p>
        </div>
        <hr className="separator" />
        <h1 className="description-label">Description</h1>
        <p className="job-description">{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobItem
