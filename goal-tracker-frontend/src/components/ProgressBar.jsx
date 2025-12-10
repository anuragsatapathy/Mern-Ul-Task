const clamp = (value) => {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 100) return 100;
  return value;
};

const ProgressBar = ({ value }) => {
  const safeValue = clamp(value);

  return (
    <div className="progress-wrapper">
      <div className="progress-bar-bg">
        <div
          className="progress-bar-fill"
          style={{ width: `${safeValue}%` }}
        />
      </div>
      <div className="progress-label">{safeValue.toFixed(1)}%</div>
    </div>
  );
};

export default ProgressBar;
