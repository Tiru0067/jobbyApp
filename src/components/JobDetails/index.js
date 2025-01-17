import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {FaStar, FaExternalLinkAlt} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'

import Header from '../Header'
import JobFailure from '../JobFailure'

import './index.css'

const apiStatusOptions = {
  INITIAL: 'INITIAL',
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
}

class JobDetails extends Component {
  state = {apiStatus: apiStatusOptions.INITIAL, jobDetails: [], similarJobs: []}

  componentDidMount() {
    this.fetchJobDetails()
  }

  fetchJobDetails = async () => {
    this.setState({apiStatus: apiStatusOptions.LOADING})
    const jwtToken = Cookies.get('jwt_token')
    const {
      match: {
        params: {id},
      },
    } = this.props
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    try {
      const response = await fetch(url, options)
      const data = await response.json()
      if (response.ok) {
        this.setState({
          apiStatus: apiStatusOptions.SUCCESS,
          jobDetails: data.job_details,
          similarJobs: data.similar_jobs,
        })
      } else {
        this.setState({apiStatus: apiStatusOptions.FAILURE})
      }
    } catch (error) {
      console.log(error)
      this.setState({apiStatus: apiStatusOptions.FAILURE})
    }
  }

  onRetry = () => {
    this.fetchJobDetails()
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobDetails = () => {
    const {jobDetails, similarJobs} = this.state
    if (jobDetails.length === undefined) {
      console.log({jobDetails, similarJobs})
    }

    const {
      title,
      job_description: jobDescription,
      package_per_annum: packagePerAnnum,
      company_website_url: companyWebsiteUrl,
      company_logo_url: companyLogoUrl,
      employment_type: employmentType,
      life_at_company: lifeAtCompany,
      skills,
      location,
      rating,
    } = jobDetails

    const {description, image_url: imageUrl} = lifeAtCompany

    return (
      <div className="job-details__container job-item">
        <div className="company-info">
          <img
            src={companyLogoUrl}
            alt="job details company logo"
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
        <div className="description-container">
          <h1 className="description-label">Description</h1>
          <a className="company-website-link" href={companyWebsiteUrl}>
            <p>Visit</p>
            <FaExternalLinkAlt />
          </a>
        </div>
        <p className="job-description">{jobDescription}</p>

        <div className="skills-container">
          <h1 className="skills-heading">Skills</h1>
          <ul className="skills-list">
            {skills.map(skill => (
              <li key={skill.name} className="skill-item">
                <img
                  src={skill.image_url}
                  alt={skill.name}
                  className="skill-image"
                />
                <p>{skill.name}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="life-at-company">
          <h1 className="life-at-company__heading">Life at Company</h1>
          <div className="life-at-company__description-container">
            <p className="life-at-company__description">{description}</p>
            <img
              src={imageUrl}
              alt="life at company"
              className="life-at-company__image"
            />
          </div>
        </div>
      </div>
    )
  }

  renderSimilarJobs = () => {
    const {similarJobs} = this.state

    return (
      <div className="similar-jobs">
        <h1 className="similar-jobs__text">Similar Jobs</h1>
        <ul className="similar-jobs__list">
          {similarJobs.map(similarJob => (
            <li className="similar-job" key={similarJob.id}>
              <div className="company-info">
                <img
                  src={similarJob.company_logo_url}
                  alt="similar job company logo"
                  className="company-logo"
                />
                <div className="job-title-rating">
                  <h1 className="job-title">{similarJob.title}</h1>
                  <div className="rating">
                    <FaStar className="rating-icon" />
                    <p className="rating-value">{similarJob.rating}</p>
                  </div>
                </div>
              </div>

              <hr className="separator" />
              <h1 className="description-label">Description</h1>
              <p className="job-description">{similarJob.job_description}</p>

              <div className="job-details">
                <div className="location">
                  <MdLocationOn className="location-icon" />
                  <p className="location-text">{similarJob.location}</p>
                </div>
                <div className="employment-type">
                  <BsFillBriefcaseFill className="employment-icon" />
                  <p className="employment-text">
                    {similarJob.employment_type}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderAll = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusOptions.LOADING:
        return this.renderLoader()
      case apiStatusOptions.SUCCESS:
        return (
          <>
            {this.renderJobDetails()}
            {this.renderSimilarJobs()}
          </>
        )

      case apiStatusOptions.FAILURE:
        return <JobFailure onRetry={this.onRetry} />
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-details__background">{this.renderAll()}</div>
      </>
    )
  }
}
export default JobDetails
