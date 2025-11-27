import React from 'react';
import { Card, CardContent } from './ui/Card';
import { cn, formatCurrency, formatNumber, formatPercentage } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: number;
  change?: number;
  format?: 'currency' | 'number';
  icon?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  format = 'number',
  icon,
}) => {
  const formattedValue = format === 'currency' ? formatCurrency(value) : formatNumber(value);
  const isPositive = change !== undefined && change >= 0;
  
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{formattedValue}</p>
            {change !== undefined && (
              <p className={cn(
                'text-sm font-medium mt-2 flex items-center',
                isPositive ? 'text-green-600' : 'text-red-600'
              )}>
                <span className="mr-1">{isPositive ? '↑' : '↓'}</span>
                {formatPercentage(Math.abs(change))}
                <span className="text-gray-500 ml-1">vs last period</span>
              </p>
            )}
          </div>
          {icon && (
            <div className="ml-4 p-3 bg-primary-50 rounded-lg text-primary-600">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
