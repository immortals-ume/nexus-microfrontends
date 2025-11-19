import { type ReactNode, useState, createContext, useContext } from 'react'

interface AccordionContextValue {
  openItems: string[]
  toggleItem: (value: string) => void
  multiple?: boolean
}

const AccordionContext = createContext<AccordionContextValue | undefined>(undefined)

const useAccordionContext = () => {
  const context = useContext(AccordionContext)
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion component')
  }
  return context
}

export interface AccordionProps {
  children: ReactNode
  multiple?: boolean
  defaultValue?: string | string[]
  className?: string
}

export const Accordion = ({ children, multiple = false, defaultValue, className = '' }: AccordionProps) => {
  const [openItems, setOpenItems] = useState<string[]>(
    defaultValue 
      ? Array.isArray(defaultValue) ? defaultValue : [defaultValue]
      : []
  )
  
  const toggleItem = (value: string) => {
    setOpenItems((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value)
      }
      return multiple ? [...prev, value] : [value]
    })
  }
  
  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, multiple }}>
      <div className={`divide-y divide-gray-200 ${className}`}>{children}</div>
    </AccordionContext.Provider>
  )
}

export interface AccordionItemProps {
  value: string
  children: ReactNode
  className?: string
}

export const AccordionItem = ({ children, className = '' }: AccordionItemProps) => {
  return <div className={className}>{children}</div>
}

export interface AccordionTriggerProps {
  value: string
  children: ReactNode
  className?: string
}

export const AccordionTrigger = ({ value, children, className = '' }: AccordionTriggerProps) => {
  const { openItems, toggleItem } = useAccordionContext()
  const isOpen = openItems.includes(value)
  
  return (
    <button
      onClick={() => toggleItem(value)}
      className={`
        flex w-full items-center justify-between py-4 text-left
        font-medium transition-all hover:underline
        ${className}
      `}
    >
      {children}
      <svg
        className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  )
}

export interface AccordionContentProps {
  value: string
  children: ReactNode
  className?: string
}

export const AccordionContent = ({ value, children, className = '' }: AccordionContentProps) => {
  const { openItems } = useAccordionContext()
  const isOpen = openItems.includes(value)
  
  if (!isOpen) return null
  
  return (
    <div className={`pb-4 pt-0 ${className}`}>
      {children}
    </div>
  )
}
