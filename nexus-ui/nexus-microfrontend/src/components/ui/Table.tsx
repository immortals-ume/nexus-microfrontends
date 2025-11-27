import { forwardRef } from 'react'
import type { ReactNode, HTMLAttributes } from 'react'

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children: ReactNode
}

export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div className="overflow-x-auto">
        <table
          ref={ref}
          className={`min-w-full divide-y divide-gray-200 ${className}`}
          {...props}
        >
          {children}
        </table>
      </div>
    )
  }
)

Table.displayName = 'Table'

export interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode
}

export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <thead ref={ref} className={`bg-gray-50 ${className}`} {...props}>
        {children}
      </thead>
    )
  }
)

TableHeader.displayName = 'TableHeader'

export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode
}

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <tbody
        ref={ref}
        className={`bg-white divide-y divide-gray-200 ${className}`}
        {...props}
      >
        {children}
      </tbody>
    )
  }
)

TableBody.displayName = 'TableBody'

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode
}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <tr ref={ref} className={`hover:bg-gray-50 ${className}`} {...props}>
        {children}
      </tr>
    )
  }
)

TableRow.displayName = 'TableRow'

export interface TableHeadProps extends HTMLAttributes<HTMLTableCellElement> {
  children: ReactNode
}

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <th
        ref={ref}
        className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}
        {...props}
      >
        {children}
      </th>
    )
  }
)

TableHead.displayName = 'TableHead'

export interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {
  children: ReactNode
}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <td
        ref={ref}
        className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${className}`}
        {...props}
      >
        {children}
      </td>
    )
  }
)

TableCell.displayName = 'TableCell'
