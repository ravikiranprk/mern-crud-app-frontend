import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegistrationList from './components/RegistrationList';
import RegistrationForm from './components/RegistrationForm';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<RegistrationList />} />
          <Route path="/create" element={<RegistrationForm />} />
          <Route path="/edit/:id" element={<RegistrationForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;