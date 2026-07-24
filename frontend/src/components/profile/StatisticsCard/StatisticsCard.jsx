import React from 'react';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import ProgressBar from '../../course/ProgressBar/ProgressBar.jsx';

const TREND_ICONS = {
  up:   TrendingUp,
  down: TrendingDown,
  flat: ArrowRight,
};

const StatisticsCard = ({
  label = 'Lessons Completed',
  value = '0',
  icon = null,
  iconColor = 'gold',   // gold | green | pink | gray
  trend = null,         // { direction: 'up'|'down'|'flat', label: '+5 this week' }
  progress = null,      // { value: 65, color: 'gold' }
}) => {
  const trendClass = trend ? `stat-card-trend--${trend.direction}` : '';
  const TrendIcon = trend ? TREND_ICONS[trend.direction] : null;

  return (
    <div className="stat-card">
      <div className={`stat-card-icon stat-card-icon--${iconColor}`}>{icon}</div>
      <div className="stat-card-body">
        <div className="stat-card-label">{label}</div>
        <div className="stat-card-value">{value}</div>

        {trend && TrendIcon && (
          <div className={`stat-card-trend ${trendClass}`}>
            <span className="stat-card-trend-icon"><TrendIcon size={14} /></span>
            <span>{trend.label}</span>
          </div>
        )}

        {progress && (
          <div className="stat-card-progress">
            <ProgressBar value={progress.value} color={progress.color || 'gold'} size="sm" showValue={false} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticsCard;
