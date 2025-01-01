import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2"; // Import Bar component instead of Line
import "../styles/Statistics.css";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "../hooks";

// Register Chart.js components for Bar chart
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
      console.log("stats", stats);
      let data = {
        labels: stats["labels"],
        datasets: [
          {
            label: type + " read",
            data: stats[type],
            backgroundColor: "rgba(76, 175, 80, 0.6)", // Bar color
            borderColor: "rgba(76, 175, 80, 1)",
            borderWidth: 1,
          },
        ],
      };

      let options = {
        responsive: true,
        plugins: {
          legend: {
            display: false, // Hides the chart legend (key),
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
            // ticks: { display: [] },
            // max: 100,
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
              <div>
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
