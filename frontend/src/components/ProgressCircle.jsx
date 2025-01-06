import "../styles/ProgressCircle.css";
function ProgressCircle({ percent, children }) {
  const circumference = 2 * Math.PI * 54;
  return (
    <div className="progress-container">
      <svg className="progress-ring" width="120" height="120">
        <circle className="progress-ring-background" cx="60" cy="60" r="54" />
        <circle
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (percent / 100) * circumference}
          className="progress-ring-bar"
          cx="60"
          cy="60"
          r="54"
        />
      </svg>
      <div className="progress-text" id="progress-text">
        <div className="progress-circle-children">{children}</div>
      </div>
    </div>
  );
}

export default ProgressCircle;
