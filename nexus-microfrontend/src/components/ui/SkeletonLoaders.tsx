import Skeleton from './Skeleton'

/**
 * Skeleton Loaders for Common UI Patterns
 * 
 * Pre-built skeleton loaders that match the structure of actual components
 * for a seamless loading experience.
 */

export function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <Skeleton variant="rectangular" height="200px" className="w-full" />
      <div className="p-4 space-y-3">
        <Skeleton variant="text" height="20px" className="w-3/4" />
        <Skeleton variant="text" height="16px" className="w-1/2" />
        <div className="flex items-center justify-between mt-4">
          <Skeleton variant="text" height="24px" className="w-1/3" />
          <Skeleton variant="rectangular" height="36px" width="100px" />
        </div>
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}

export function CartItemSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
      <Skeleton variant="rectangular" width="80px" height="80px" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" height="18px" className="w-3/4" />
        <Skeleton variant="text" height="16px" className="w-1/2" />
        <Skeleton variant="text" height="20px" className="w-1/4" />
      </div>
      <Skeleton variant="rectangular" width="100px" height="36px" />
    </div>
  )
}

export function CartSkeleton({ itemCount = 3 }: { itemCount?: number }) {
  return (
    <div className="space-y-0">
      {Array.from({ length: itemCount }).map((_, index) => (
        <CartItemSkeleton key={index} />
      ))}
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <Skeleton variant="text" height="16px" width="80px" />
          <Skeleton variant="text" height="16px" width="60px" />
        </div>
        <div className="flex justify-between">
          <Skeleton variant="text" height="16px" width="60px" />
          <Skeleton variant="text" height="16px" width="50px" />
        </div>
        <div className="flex justify-between font-bold">
          <Skeleton variant="text" height="20px" width="70px" />
          <Skeleton variant="text" height="20px" width="80px" />
        </div>
        <Skeleton variant="rectangular" height="48px" className="w-full mt-4" />
      </div>
    </div>
  )
}

export function OrderCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <Skeleton variant="text" height="20px" className="w-1/3" />
          <Skeleton variant="text" height="16px" className="w-1/4" />
        </div>
        <Skeleton variant="rectangular" height="28px" width="100px" />
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" height="16px" className="w-full" />
        <Skeleton variant="text" height="16px" className="w-3/4" />
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
        <Skeleton variant="text" height="18px" width="100px" />
        <Skeleton variant="rectangular" height="36px" width="120px" />
      </div>
    </div>
  )
}

export function OrderListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <OrderCardSkeleton key={index} />
      ))}
    </div>
  )
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-gray-200 dark:border-gray-700">
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="px-4 py-3">
          <Skeleton variant="text" height="16px" />
        </td>
      ))}
    </tr>
  )
}

export function TableSkeleton({ rows = 10, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            {Array.from({ length: columns }).map((_, index) => (
              <th key={index} className="px-4 py-3">
                <Skeleton variant="text" height="16px" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, index) => (
            <TableRowSkeleton key={index} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" width="80px" height="80px" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" height="24px" className="w-1/3" />
          <Skeleton variant="text" height="16px" className="w-1/2" />
        </div>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton variant="text" height="14px" width="100px" />
          <Skeleton variant="rectangular" height="40px" className="w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton variant="text" height="14px" width="100px" />
          <Skeleton variant="rectangular" height="40px" className="w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton variant="text" height="14px" width="100px" />
          <Skeleton variant="rectangular" height="40px" className="w-full" />
        </div>
      </div>
      <div className="flex gap-3 pt-4">
        <Skeleton variant="rectangular" height="40px" width="120px" />
        <Skeleton variant="rectangular" height="40px" width="100px" />
      </div>
    </div>
  )
}

export function DashboardMetricSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-3">
      <Skeleton variant="text" height="16px" className="w-1/2" />
      <Skeleton variant="text" height="32px" className="w-2/3" />
      <Skeleton variant="text" height="14px" className="w-1/3" />
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <DashboardMetricSkeleton key={index} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <Skeleton variant="text" height="20px" className="w-1/3 mb-4" />
          <Skeleton variant="rectangular" height="300px" className="w-full" />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <Skeleton variant="text" height="20px" className="w-1/3 mb-4" />
          <Skeleton variant="rectangular" height="300px" className="w-full" />
        </div>
      </div>
    </div>
  )
}
