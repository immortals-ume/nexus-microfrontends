import { useState, useRef, useEffect } from 'react'
import type { ReactNode } from 'react'

export interface DropdownItem {
  label: string
  value: string
  icon?: ReactNode
  disabled?: boolean
  onClick?: () => void
}

export interface DropdownProps {
  trigger: ReactNode
  items: DropdownItem[]
  position?: 'left' | 'right'
  className?: string
}

const Dropdown = ({ trigger, items, position = 'left', className = '' }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])
  
  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled && item.onClick) {
      item.onClick()
      setIsOpen(false)
    }
  }
  
  const positionStyles = position === 'right' ? 'right-0' : 'left-0'
  
  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      
      {isOpen && (
        <div
          className={`
            absolute ${positionStyles} mt-2 w-56 rounded-lg bg-white shadow-lg
            border border-gray-200 z-50 py-1
            ${className}
          `}
        >
          {items.map((item) => (
            <button
              key={item.value}
              onClick={() => handleItemClick(item)}
              disabled={item.disabled}
              className={`
                w-full flex items-center px-4 py-2 text-sm text-left
                ${item.disabled 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              {item.icon && <span className="mr-3">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dropdown
