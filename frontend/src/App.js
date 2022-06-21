import './App.css';
import {Routes, Route, BrowserRouter} from 'react-router-dom';

import AuthorPage from './routes/authorPage';
import AuthorInfoPage from './routes/authorInfoPage';
import LoginPage from './routes/loginPage';
import { useContext, useEffect, useState } from 'react';
import AuthContext from './context/auth';
import RegistrationPage from './routes/registrationPage';
import AuthorSearchPage from './routes/authorSearchPage';


function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let auth = localStorage.getItem('auth');
    if (auth != null) {
      setUser(JSON.parse(auth));
    }
  }, [])

  return (
    <div className="App">
      <AuthContext.Provider value={{user, setUser}}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AuthorSearchPage/>}/>
            <Route path="/author" element={<AuthorPage />}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/register" element={<RegistrationPage />}/>
            <Route path="/author/info" element={<AuthorInfoPage/>}/>
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
