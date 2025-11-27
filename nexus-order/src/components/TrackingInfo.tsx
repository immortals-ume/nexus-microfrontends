import { ExternalLink, Package } from 'lucide-react';
import { cn } from '../lib/utils';

interface TrackingInfoProps {
  trackingNumber?: string;
  trackingUrl?: string;
  className?: string;
}

/**
 * TrackingInfo component - Display shipping tracking information
 * Validates: Requirements 8.5 - Display tracking information
 */
export function TrackingInfo({ trackingNumber, trackingUrl, className }: TrackingInfoProps) {
  if (!trackingNumber) {
    return null;
  }

  return (
    <div className={cn('bg-blue-50 border border-blue-200 rounded-lg p-4', className)}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <Package className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Tracking Information</h3>
          <p className="text-sm text-gray-600 mb-2">
            Tracking Number: <span className="font-mono font-medium">{trackingNumber}</span>
          </p>
          {trackingUrl && (
            <a
              href={trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Track Package
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
