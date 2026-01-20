import React from 'react';

interface Props {
  current: number;
  total: number;
}

const ProgressBar: React.FC<Props> = ({ current, total }) => {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-gray-700">Step {current}/{total}</div>
        <div className="text-sm text-gray-500">{pct}%</div>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded overflow-hidden">
        <div
          className="h-full bg-indigo-500 rounded transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
