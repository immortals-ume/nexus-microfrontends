import { Suspense, lazy } from 'react'
import ErrorBoundary from './ErrorBoundary'

interface RemoteLoaderProps {
  name: string
  module: string
  fallback?: React.ReactNode
}

const RemoteLoader: React.FC<RemoteLoaderProps> = ({ name, module, fallback }) => {
  // @ts-ignore - Module federation dynamic import
  const Component = lazy(() => import(/* @vite-ignore */ `${name}/${module}`))

  const loadingFallback =
    fallback ||
    (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div className="spinner" />
        <p>Loading {name}…</p>
      </div>
    )

  return (
    <ErrorBoundary name={name}>
      <Suspense fallback={loadingFallback}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  )
}

export default RemoteLoader
