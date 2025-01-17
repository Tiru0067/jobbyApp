import {Link} from 'react-router-dom'
import './index.css'
import Header from '../Header'

const Home = () => (
  <>
    <Header />
    <div className="home">
      <h1 className="home__title">Find The Job That Fits Your Life</h1>
      <p className="home__description">
        Millions of people are searching for jobs, salary, information, company
        reviews. Find the job that fits your abilities and potential.
      </p>

      <Link to="/jobs" className="home__jobs-link">
        <button type="button" className="home__jobs-button">
          Find Jobs
        </button>
      </Link>
    </div>
  </>
)

export default Home
