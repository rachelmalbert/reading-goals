import "../styles/Goals.css";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "../hooks";
import { useApi } from "../hooks";
import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useState, useEffect } from "react";

function yearMonthDay() {
  const date = new Date();
  const year = date.getFullYear();
  const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
    date
  );
  const day = date.getDate();
  return { month: month, day: day, year: year };
}

function TodaysGoal() {
  const user = useUser();
  const api = useApi();
  const [enabledProgressQuery, setEnabledProgressQuery] = useState(false);
  let type = "";
  let periodName = "";
  let amount = "";

  let y_m_d = yearMonthDay();
  const today = `${y_m_d.month} ${y_m_d.day}`;

  const {
    data: dataGoal,
    isLoading: isLoadingGoal,
    isSuccess: isSuccessGoal,
  } = useQuery({
    queryKey: ["todays_goal", user.id],
    queryFn: () => api.get("/goals/day").then((response) => response.json()),
  });

  if (dataGoal) {
    type = dataGoal.type;
    amount = dataGoal.amount;
  }
  const { data: progressData } = useQuery({
    queryKey: ["todays_progress", user.id, type, periodName],
    queryFn: () =>
      api
        .get(`/goals/progress/${type}/day`)
        .then((response) => response.json()),
    enabled: enabledProgressQuery,
  });

  // When the first query (todays_goal) is successful, enable the second query
  useEffect(() => {
    if (isSuccessGoal) {
      setEnabledProgressQuery(true); // Enable second query
    }
  }, [isSuccessGoal]);

  let percent = 0;
  if (progressData) {
    percent = Math.floor((progressData / amount) * 100);
  }

  if (isLoadingGoal) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="daily-goal-container">
        <div className="daily-goal-header">Today's Goal</div>
        <div className="daily-goal-progress">
          <div>{today}</div>
          <div>
            {progressData} of {amount}
          </div>
          <div className="capitalize">{type} Read</div>
          <div className="progress-circle">
            {percent < 100 && (
              <CircularProgressbarWithChildren
                styles={buildStyles({
                  pathColor: "#8c6a4d",
                  trailColor: "#eee",
                })}
                value={percent}
              >
                {percent}%
              </CircularProgressbarWithChildren>
            )}
            {percent >= 100 && (
              <CircularProgressbarWithChildren
                styles={buildStyles({
                  pathColor: "#8c6a4d",
                  trailColor: "#eee",
                })}
                value={percent}
              >
                <div>Done!</div>
              </CircularProgressbarWithChildren>
            )}
          </div>
        </div>
      </div>
    );
  }
}

function GoalCard({ goal }) {
  const amount = goal["amount"];
  const type = goal["type"];
  let period = "";
  let periodName = goal["period"];
  const user = useUser();
  const api = useApi();

  let y_m_d = yearMonthDay();

  if (periodName === "year") {
    period = y_m_d.year;
  }
  if (periodName === "month") {
    period = y_m_d.month;
  }

  const { data: progress } = useQuery({
    queryKey: ["progress", user.id, type, periodName],
    queryFn: () =>
      api
        .get(`/goals/progress/${type}/${periodName}`)
        .then((response) => response.json()),
  });

  let percent = 0;
  if (progress) {
    percent = Math.floor((progress / amount) * 100);
  }
  return (
    <div className="goal-card">
      <div className="goal-card-left">
        <div className="goal-period">
          <div className="period-name">{periodName}</div>
          <div className="period-value">{period}</div>
        </div>
        <div className="goal-progress">
          <div className="goal-progress-name">{type} Read</div>
          <div className="goal-progress-value">
            {progress} of {amount}
          </div>
        </div>
      </div>
      <div className="progress-circle">
        <CircularProgressbar
          styles={buildStyles({
            pathColor: "#8c6a4d",
            trailColor: "#eee",
          })}
          value={percent}
          text={`${percent}%`}
        ></CircularProgressbar>
      </div>
    </div>
  );
}

function MyGoals() {
  const user = useUser();
  const api = useApi();

  const { data, isLoading } = useQuery({
    queryKey: ["goals", user.id],
    queryFn: () => api.get("/goals").then((response) => response.json()),
  });

  if (data) {
    const yearlyGoal = data.filter((goal) => goal.period === "year")[0];
    const monthlyGoal = data.filter((goal) => goal.period === "month")[0];
    const todaysGoal = data.filter((goal) => goal.period === "day")[0];

    return (
      <>
        <div className="goals-container">
          <GoalCard goal={yearlyGoal}></GoalCard>
          <GoalCard goal={monthlyGoal}></GoalCard>
        </div>
      </>
    );
  } else {
    return <>{isLoading && <p>Loading...</p>}</>;
  }
}

function Goals() {
  return (
    <>
      <MyGoals></MyGoals>
    </>
  );
}

export { Goals, TodaysGoal };
