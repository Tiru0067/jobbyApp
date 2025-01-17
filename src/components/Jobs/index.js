import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import './index.css'
import Header from '../Header'
import JobItem from '../JobItem'
import JobFailure from '../JobFailure'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusOptions = {
  INITIAL: 'INITIAL',
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
}

class Jobs extends Component {
  state = {
    profileApiStatus: apiStatusOptions.INITIAL,
    jobsApiStatus: apiStatusOptions.INITIAL,
    selectedEmploymentTypes: [],
    selectedSalaryRange: '',
    profileData: [],
    jobsList: [],
    searchInput: '',
  }

  componentDidMount() {
    this.fetchProfileData()
    this.fetchJobsData()
  }

  fetchData = async (url, updateStatusKey, dataKey) => {
    this.setState({[updateStatusKey]: apiStatusOptions.LOADING})

    const jwtToken = Cookies.get('jwt_token')
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
          [updateStatusKey]: apiStatusOptions.SUCCESS,
          [dataKey]: data,
        })
      } else {
        this.setState({[updateStatusKey]: apiStatusOptions.FAILURE})
      }
    } catch (error) {
      this.setState({[updateStatusKey]: apiStatusOptions.FAILURE})
      console.error('Fetch error:', error)
    }
  }

  // Fetch profile data
  fetchProfileData = () => {
    const profileUrl = 'https://apis.ccbp.in/profile'
    this.fetchData(profileUrl, 'profileApiStatus', 'profileData')
  }

  // Fetch jobs data
  fetchJobsData = () => {
    const {
      selectedEmploymentTypes,
      selectedSalaryRange,
      searchInput: search,
    } = this.state

    const jobsUrl = `https://apis.ccbp.in/jobs?employment_type=${selectedEmploymentTypes.join(
      ',',
    )}&minimum_package=${selectedSalaryRange}&search=${search}`

    this.fetchData(jobsUrl, 'jobsApiStatus', 'jobsList')
  }

  handleEmploymentTypeChange = event => {
    const {selectedEmploymentTypes} = this.state
    const {id, checked} = event.target

    if (checked) {
      this.setState(
        {
          selectedEmploymentTypes: [...selectedEmploymentTypes, id],
        },
        this.fetchJobsData,
      )
    } else {
      this.setState(
        {
          selectedEmploymentTypes: selectedEmploymentTypes.filter(
            typeId => typeId !== id,
          ),
        },
        this.fetchJobsData,
      )
    }
  }

  handleSalaryChange = event => {
    this.setState({selectedSalaryRange: event.target.value}, this.fetchJobsData)
  }

  handleSearchSubmit = event => {
    event.preventDefault()
    this.fetchJobsData()
  }

  renderProfileDetails = () => {
    const {
      profileData: {profile_details: profileDetails},
    } = this.state

    console.log(profileDetails)

    return (
      <div className="profile-container">
        <img
          src={profileDetails.profile_image_url}
          alt="profile"
          className="profile-image"
        />
        <h1 className="profile-name">{profileDetails.name}</h1>
        <p className="profile-bio">{profileDetails.short_bio}</p>
      </div>
    )
  }

  onSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  renderNoJob = () => (
    <div className="job-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="error-image"
      />
      <h1>No Jobs Found</h1>
      <p className="error-message">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  renderJobsList = () => {
    const {
      jobsList: {jobs: jobsList},
    } = this.state

    console.log(jobsList)

    return (
      <>
        {jobsList.length > 0 ? (
          <ul className="jobs-list-container">
            {jobsList.map(jobDetails => (
              <JobItem key={jobDetails.id} jobDetails={jobDetails} />
            ))}
          </ul>
        ) : (
          this.renderNoJob()
        )}
      </>
    )
  }

  onRetryJobs = () => {
    this.fetchJobsData()
  }

  onRetryProfile = () => {
    this.fetchProfileData()
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderSearchBar = () => {
    const {searchInput} = this.state

    return (
      <div className="search-container">
        <input
          type="search"
          placeholder="Search"
          className="search-field"
          value={searchInput}
          onChange={this.onSearchInput}
        />
        <button
          className="search-submit"
          type="button"
          data-testid="searchButton"
          onClick={this.handleSearchSubmit}
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  renderProfileRetryButton = () => (
    <div className="profile__retry-button-container">
      <button
        type="button"
        className="profile__retry-button"
        onClick={this.onRetryProfile}
      >
        Retry
      </button>
    </div>
  )

  renderProfile = () => {
    const {profileApiStatus} = this.state

    switch (profileApiStatus) {
      case apiStatusOptions.LOADING:
        return this.renderLoader()
      case apiStatusOptions.SUCCESS:
        return this.renderProfileDetails()
      case apiStatusOptions.FAILURE:
        return this.renderProfileRetryButton()
      default:
        return null
    }
  }

  renderJobs = () => {
    const {jobsApiStatus} = this.state

    switch (jobsApiStatus) {
      case apiStatusOptions.LOADING:
        return this.renderLoader()
      case apiStatusOptions.SUCCESS:
        return this.renderJobsList()
      case apiStatusOptions.FAILURE:
        return <JobFailure onRetry={this.onRetryJobs} />
      default:
        return null
    }
  }

  render() {
    const {selectedSalaryRange} = this.state

    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="jobs-filters">
            <div className="mobile-search-wrapper">
              {this.renderSearchBar()}
            </div>
            {this.renderProfile()}
            <hr />
            <div className="employment-type-filter">
              <h1 className="employment-header">Type of Employment</h1>
              <ul className="employment-types-list">
                {employmentTypesList.map(type => (
                  <li
                    key={type.employmentTypeId}
                    className="employment-type-item"
                  >
                    <input
                      id={type.employmentTypeId}
                      type="checkbox"
                      className="employment-checkbox"
                      onChange={this.handleEmploymentTypeChange}
                    />
                    <label
                      htmlFor={type.employmentTypeId}
                      className="employment-label"
                    >
                      {type.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <hr />
            <div className="salary-range-filter">
              <h1 className="salary-header">Salary Range</h1>
              <ul className="salary-ranges-list">
                {salaryRangesList.map(salary => (
                  <li key={salary.salaryRangeId} className="salary-range-item">
                    <input
                      id={salary.salaryRangeId}
                      type="radio"
                      name="salary"
                      value={salary.salaryRangeId}
                      checked={selectedSalaryRange === salary.salaryRangeId}
                      onChange={this.handleSalaryChange}
                      className="salary-radio"
                    />
                    <label
                      htmlFor={salary.salaryRangeId}
                      className="salary-label"
                    >
                      {salary.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="jobslist-wrapper">
            <div className="desktop-search-wrapper">
              {this.renderSearchBar()}
            </div>
            {this.renderJobs()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
