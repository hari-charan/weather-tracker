import { useNavigate } from "react-router-dom";
import Paths from "src/constants/paths";
import "../App.css"; 

const HomePage = () => {
  let navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="button-container">
        <button className="custom-button" onClick={() => navigate(Paths.CREATE_PAGE)}>
          Create a Job
        </button>

        <button className="custom-button" onClick={() => navigate(Paths.HISTORY_PAGE)}>
          Show History
        </button>
      </div>
    </div>
  );
};

export default HomePage;
