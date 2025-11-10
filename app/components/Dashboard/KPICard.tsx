import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  iconColor,
  iconBg
}) => {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return `$${(val / 1000000).toFixed(1)}M`;
      } else if (val >= 1000) {
        return `$${(val / 1000).toFixed(0)}K`;
      } else if (val > 0 && val < 1) {
        return `${(val * 100).toFixed(1)}%`;
      }
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 font-medium text-sm">{title}</h3>
        <div className={`p-2 ${iconBg} rounded-lg`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>
      
      <p className="text-3xl font-bold text-gray-900 mb-2">
        {formatValue(value)}
      </p>
      
      {change && (
        <p className={`text-sm ${change.isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {change.isPositive ? '+' : ''}{change.value}% {change.label}
        </p>
      )}
    </div>
  );
};