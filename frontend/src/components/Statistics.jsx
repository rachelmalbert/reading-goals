import "../styles/Statistics.css";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "../hooks";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Statistics = () => {
  const api = useApi();
  const [period, setPeriod] = useState("weekly");
  const [type, setType] = useState("pages");
  const [chartData, setChartData] = useState();
  const [chartOptions, setChartOptions] = useState();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["stats", period],
    queryFn: () => api.get(`/stats/${period}`).then((response) => response.json()),
  });

  useEffect(() => {
    if (stats) {
      let data = {
        labels: stats["labels"],
        datasets: [
          {
            label: type + " read",
            data: stats[type],
            backgroundColor: "rgba(76, 175, 80, 0.6)",
            borderColor: "rgba(76, 175, 80, 1)",
            borderWidth: 1,
          },
        ],
      };

      let options = {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            title: {
              display: false,
              text: period === "weekly" ? "Day of Week" : period === "monthly" ? "Day of Month" : "Month",
            },
          },
          y: {
            title: {
              display: true,
              text: type,
            },
            beginAtZero: true,
          },
        },
      };

      setChartData(data);
      setChartOptions(options);
    }
  }, [stats, period, type]);

  if (isLoading) {
    return <div>Loading..</div>;
  } else {
    return (
      <div className="statistics-container">
        <div className="statistics-header">
          <h2>My Stats</h2>
          <div className="time-period-toggle">
            {["weekly", "monthly", "yearly"].map((timePeriod) => (
              <button key={timePeriod} className={`toggle-btn ${period === timePeriod ? "active" : ""}`} onClick={() => setPeriod(timePeriod)}>
                {timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)}
              </button>
            ))}
          </div>
          <div className="goal-type-toggle">
            {["pages", "minutes"].map((goalType) => (
              <div key={goalType}>
                <label htmlFor={goalType}>{goalType}</label>
                <button
                  className={`toggle-radio ${type === goalType ? "active" : ""}`}
                  key={goalType}
                  type="radio"
                  onClick={() => setType(goalType)}
                ></button>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-container">{chartData && <Bar data={chartData} options={chartOptions} />}</div>
      </div>
    );
  }
};

export default Statistics;
