import "../styles/Goals.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../hooks";
import { useState } from "react";
import FormInput from "./FormInput";
import ProgressCircle from "./ProgressCircle";
import { yearMonthDay } from "../utils";
import Popup from "./Popup";

function EditGoalForm({ goal, setShowEditGoal }) {
  const api = useApi();
  const queryClient = useQueryClient();
  const [period, setPeriod] = useState(goal.period);
  const [amount, setAmount] = useState(goal.amount);
  const [type, setType] = useState(goal.type);

  const goalUpdate = {
    type,
    period,
    amount,
  };

  const mutation = useMutation({
    mutationFn: (goalUpdate) => api.put(`/goals/update/${goal.id}`, goalUpdate).then((response) => response.json()),
    onSuccess: () => {
      queryClient.invalidateQueries([goal.id]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(goalUpdate);
    setShowEditGoal(false);
  };

  return (
    <form onSubmit={handleSubmit} className="edit-goal-form">
      <div>I want to read {type === "minutes" && "for"}</div>
      <div className="edit-goal-input">
        <FormInput type="text" setter={setAmount} placeholder={goal.amount}></FormInput>
        <select value={type} className="select-type" onChange={(e) => setType(e.target.value)}>
          <option>books</option>
          <option>pages</option>
          <option>minutes</option>
        </select>
        <p>per</p>
        <select value={period} className="select-period" onChange={(e) => setPeriod(e.target.value)}>
          <option>year</option>
          <option>month</option>
          <option>day</option>
        </select>
      </div>

      <button type="submit" className="edit-goal-btn">
        Update Goal
      </button>
    </form>
  );
}

function GoalCard({ goal }) {
  const { amount, type, period } = goal;
  const [showEditGoal, setShowEditGoal] = useState(false);
  const api = useApi();

  const { data: progress } = useQuery({
    queryKey: ["goal-progress", goal.id],
    queryFn: () => api.get(`/goals/progress/${goal.id}`).then((response) => response.json()),
  });

  const handleEditIconClick = (event) => {
    event.preventDefault();
    setShowEditGoal(true);
  };

  return (
    <>
      <div className="goal-card">
        <div className="overlay">
          <i onClick={handleEditIconClick} className="fas fa-edit edit-icon"></i>
        </div>

        <div className="goal-header">
          {period === "year" && "Yearly Goal"}
          {period === "month" && "Monthly Goal"}
          {period === "day" && "Daily Goal"}
        </div>

        <div className="goal-period">
          {period === "year" && yearMonthDay().year()}
          {period === "month" && yearMonthDay().month()}
          {period === "day" && yearMonthDay().day()}
        </div>

        <div className="progress-circle">
          <ProgressCircle percent={`${progress ? (progress >= amount ? 100 : Math.floor((progress / amount) * 100)) : 0}`}>
            <div>{`${progress ? progress : 0} of ${amount}`}</div>
            <p>{type}</p>
          </ProgressCircle>
        </div>
      </div>

      <Popup isOpen={showEditGoal} onClose={() => setShowEditGoal(false)}>
        <EditGoalForm goal={goal} setShowEditGoal={setShowEditGoal}></EditGoalForm>
      </Popup>
    </>
  );
}

function Goals() {
  const api = useApi();

  const { data: goals, isLoading } = useQuery({
    queryKey: ["goals"],
    queryFn: () => api.get("/goals").then((response) => response.json()),
  });

  if (goals) {
    return (
      <>
        <GoalCard goal={goals[0]}></GoalCard>
        <GoalCard goal={goals[1]}></GoalCard>
      </>
    );
  } else {
    return <>{isLoading && <p>Loading...</p>}</>;
  }
}

export { Goals };
