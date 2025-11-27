import './App.css'

function App() {
  return (
    <div className="mf-container">
      <h2>📈 Analytics Micro Frontend</h2>
      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Page Views</h3>
          <div className="chart-placeholder">
            <div className="bar" style={{ height: '60%' }}></div>
            <div className="bar" style={{ height: '75%' }}></div>
            <div className="bar" style={{ height: '85%' }}></div>
            <div className="bar" style={{ height: '70%' }}></div>
          </div>
          <p className="analytics-value">45.2K views</p>
        </div>
        <div className="analytics-card">
          <h3>Unique Visitors</h3>
          <div className="chart-placeholder">
            <div className="bar" style={{ height: '50%' }}></div>
            <div className="bar" style={{ height: '65%' }}></div>
            <div className="bar" style={{ height: '75%' }}></div>
            <div className="bar" style={{ height: '60%' }}></div>
          </div>
          <p className="analytics-value">12.8K visitors</p>
        </div>
        <div className="analytics-card">
          <h3>Conversion Rate</h3>
          <div className="chart-placeholder">
            <div className="bar" style={{ height: '40%' }}></div>
            <div className="bar" style={{ height: '45%' }}></div>
            <div className="bar" style={{ height: '35%' }}></div>
            <div className="bar" style={{ height: '50%' }}></div>
          </div>
          <p className="analytics-value">3.24%</p>
        </div>
        <div className="analytics-card">
          <h3>Bounce Rate</h3>
          <div className="chart-placeholder">
            <div className="bar" style={{ height: '55%' }}></div>
            <div className="bar" style={{ height: '50%' }}></div>
            <div className="bar" style={{ height: '60%' }}></div>
            <div className="bar" style={{ height: '45%' }}></div>
          </div>
          <p className="analytics-value">42.1%</p>
        </div>
      </div>
    </div>
  )
}

export default App
