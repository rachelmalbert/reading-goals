import React, { useState } from "react";
import { Bar } from "react-chartjs-2"; // Import Bar component instead of Line
import "./Statistics.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components for Bar chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Statistics = () => {
  const [period, setPeriod] = useState("daily");

  // Mock data for each period
  const getChartData = (period) => {
    switch (period) {
      case "daily":
        return {
          labels: ["12 AM", "6 AM", "12 PM", "6 PM", "12 AM"],
          datasets: [
            {
              label: "Pages Read",
              data: [5, 8, 12, 10, 6],
              backgroundColor: "rgba(76, 175, 80, 0.6)", // Bar color
              borderColor: "rgba(76, 175, 80, 1)",
              borderWidth: 1,
            },
          ],
        };
      case "weekly":
        return {
          labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          datasets: [
            {
              label: "Pages Read",
              data: [35, 50, 45, 60, 40, 55, 70],
              backgroundColor: "rgba(76, 175, 80, 0.6)", // Bar color
              borderColor: "rgba(76, 175, 80, 1)",
              borderWidth: 1,
            },
          ],
        };
      case "monthly":
        return {
          labels: Array.from({ length: 31 }, (_, i) => `${i + 1}`),
          datasets: [
            {
              label: "Pages Read",
              data: Array(31)
                .fill(30)
                .map(() => Math.random() * 50),
              backgroundColor: "rgba(76, 175, 80, 0.6)", // Bar color
              borderColor: "rgba(76, 175, 80, 1)",
              borderWidth: 1,
            },
          ],
        };
      case "yearly":
        return {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          datasets: [
            {
              label: "Pages Read",
              data: Array(12)
                .fill(100)
                .map(() => Math.random() * 150),
              backgroundColor: "rgba(76, 175, 80, 0.6)", // Bar color
              borderColor: "rgba(76, 175, 80, 1)",
              borderWidth: 1,
            },
          ],
        };
      default:
        return {};
    }
  };

  const chartData = getChartData(period);

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text:
            period === "daily"
              ? "Time of Day"
              : period === "weekly"
              ? "Day of Week"
              : period === "monthly"
              ? "Day of Month"
              : "Month",
        },
      },
      y: {
        title: {
          display: true,
          text: "Pages",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="statistics-container">
      <div className="statistics-header">
        <h2>My Stats</h2>
        <div className="time-period-toggle">
          {["daily", "weekly", "monthly", "yearly"].map((timePeriod) => (
            <button
              key={timePeriod}
              className={`toggle-btn ${period === timePeriod ? "active" : ""}`}
              onClick={() => setPeriod(timePeriod)}
            >
              {timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-container">
        {/* Use Bar chart instead of Line */}
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default Statistics;
