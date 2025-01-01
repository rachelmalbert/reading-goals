import "./DashboardPage.css";

import Sessions from "../components/Sessions";
import Totals from "../components/Totals";
import { DailyGoal, Goals, TodaysGoal, YearlyGoal } from "../components/Goals";
import { useUser } from "../hooks";
import NowReadingCard from "../components/NowReadingCard";
import UpdateBook from "../components/UpdateBook";
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
            </div>
            <div className="bottom">
              <Statistics></Statistics>
            </div>
          </div>
          <div className="right">
            <NowReadingCard></NowReadingCard>

            <Sessions></Sessions>
          </div>
        </div>
      </div>
    </>
  );
}
export default DashboardPage;
