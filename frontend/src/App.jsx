  import './App.css';
  import { Route , Routes} from 'react-router-dom';
  import { Details } from './components/Details/Details.jsx';
  import Laser from './components/Laser';
  import ProfilePage from './components/Profile/Profile.jsx';
  import Dashboard from './components/dashboard/Dashboard';
  import Signup from './components/authentication/Signup.jsx';
  import History from './components/History/History.jsx';
  import Hero from './components/Landing/Landing.jsx';

  function App() {
  return (
        <Routes>
          <Route path='/' element={<Hero />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/details' element={<Details />} />
          <Route path='/profile' element={<ProfilePage/>} />
          <Route path='/history' element={<History/>} />
        </Routes>
  );
}

export default App;
