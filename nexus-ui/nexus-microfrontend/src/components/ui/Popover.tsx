import { type ReactNode, useState, useRef, useEffect } from 'react'

export interface PopoverProps {
  trigger: ReactNode
  content: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

const Popover = ({ trigger, content, position = 'bottom', className = '' }: PopoverProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
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
  
  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }
  
  return (
    <div className="relative inline-block" ref={popoverRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      {isOpen && (
        <div
          className={`
            absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg
            ${positionStyles[position]}
            ${className}
          `}
        >
          {content}
        </div>
      )}
    </div>
  )
}

export default Popover
