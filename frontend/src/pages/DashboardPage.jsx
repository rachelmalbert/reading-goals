import "../styles/DashboardPage.css";
import { useUser } from "../hooks";
import Sessions from "../components/Sessions";
import Totals from "../components/Totals";
import { Goals } from "../components/Goals";
import NowReadingCard from "../components/NowReadingCard";
import Statistics from "../components/Statistics";

function DashboardPage() {
  const user = useUser();

  return (
    <>
      <div className="dashboard">
        <div className="welcome-back-container">
          <div className="welcome-back">Welcome Back,</div>
          <div className="name">{user.username}</div>
        </div>
        <div className="dashboard-content">
          <div className="left">
            <Totals></Totals>
            <div className="middle">
              <Goals></Goals>
            </div>
            <div className="bottom">
              <NowReadingCard></NowReadingCard>
              <Statistics></Statistics>
            </div>
          </div>
          <div className="right">
            <Sessions></Sessions>
          </div>
        </div>
      </div>
    </>
  );
}
export default DashboardPage;
