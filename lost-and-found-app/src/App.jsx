import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import LostItemForm from './components/LostItemForm';
import FoundItemForm from './components/FoundItemForm';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<Navigate to="/report-lost" replace />} />
          <Route path="/report-lost" element={<LostItemForm />} />
          <Route path="/report-found" element={<FoundItemForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;