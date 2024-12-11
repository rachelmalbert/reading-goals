import Sessions from "../components/Sessions";
import Totals from "../components/Totals";
import { Goals, TodaysGoal } from "../components/Goals";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";
import "./DashboardPage.css";
import CurrentBook from "../components/CurrentBook";
import Statistics from "../components/Statistics";

function DashboardPage() {
  const user = useUser();
  return (
    <>
      <div className="dashboard">
        <div className="welcome-back-container">
          <div className="welcome-back">Welcome Back,</div>
          <div className="name">{user.first_name}</div>
        </div>
        <div className="dashboard-content">
          <div className="left">
            <Totals></Totals>
            <div className="middle">
              <Goals></Goals>
              <TodaysGoal></TodaysGoal>
            </div>
            <div className="bottom">
              <Statistics></Statistics>
            </div>
          </div>
          <div className="right">
            <CurrentBook></CurrentBook>

            <Sessions></Sessions>
          </div>
        </div>
      </div>
    </>
  );
}
export default DashboardPage;
