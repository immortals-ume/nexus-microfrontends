import type { ButtonHTMLAttributes } from 'react'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

const Pagination = ({ currentPage, totalPages, onPageChange, className = '' }: PaginationProps) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  
  const getVisiblePages = () => {
    if (totalPages <= 7) return pages
    
    if (currentPage <= 3) {
      return [...pages.slice(0, 5), '...', totalPages]
    }
    
    if (currentPage >= totalPages - 2) {
      return [1, '...', ...pages.slice(totalPages - 5)]
    }
    
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
  }
  
  const visiblePages = getVisiblePages()
  
  return (
    <nav className={`flex items-center justify-center space-x-2 ${className}`}>
      <PaginationButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </PaginationButton>
      
      {visiblePages.map((page, index) => (
        typeof page === 'number' ? (
          <PaginationButton
            key={page}
            onClick={() => onPageChange(page)}
            isActive={currentPage === page}
          >
            {page}
          </PaginationButton>
        ) : (
          <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
            {page}
          </span>
        )
      ))}
      
      <PaginationButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </PaginationButton>
    </nav>
  )
}

interface PaginationButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean
}

const PaginationButton = ({ isActive, className = '', children, ...props }: PaginationButtonProps) => {
  return (
    <button
      className={`
        px-3 py-2 text-sm font-medium rounded-lg transition-colors
        ${isActive 
          ? 'bg-primary-600 text-white' 
          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
        }
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}

export default Pagination
