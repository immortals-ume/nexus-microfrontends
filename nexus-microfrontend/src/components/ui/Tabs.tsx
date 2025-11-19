import { useState, createContext, useContext } from 'react'
import type { ReactNode } from 'react'

interface TabsContextValue {
  activeTab: string
  setActiveTab: (value: string) => void
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined)

const useTabsContext = () => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs component')
  }
  return context
}

export interface TabsProps {
  defaultValue: string
  children: ReactNode
  className?: string
}

export const Tabs = ({ defaultValue, children, className = '' }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue)
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

export interface TabsListProps {
  children: ReactNode
  className?: string
}

export const TabsList = ({ children, className = '' }: TabsListProps) => {
  return (
    <div className={`flex border-b border-gray-200 ${className}`}>
      {children}
    </div>
  )
}

export interface TabsTriggerProps {
  value: string
  children: ReactNode
  className?: string
}

export const TabsTrigger = ({ value, children, className = '' }: TabsTriggerProps) => {
  const { activeTab, setActiveTab } = useTabsContext()
  const isActive = activeTab === value
  
  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`
        px-4 py-2 text-sm font-medium transition-colors
        ${isActive 
          ? 'border-b-2 border-primary-600 text-primary-600' 
          : 'text-gray-500 hover:text-gray-700'
        }
        ${className}
      `}
    >
      {children}
    </button>
  )
}

export interface TabsContentProps {
  value: string
  children: ReactNode
  className?: string
}

export const TabsContent = ({ value, children, className = '' }: TabsContentProps) => {
  const { activeTab } = useTabsContext()
  
  if (activeTab !== value) return null
  
  return <div className={`pt-4 ${className}`}>{children}</div>
}
