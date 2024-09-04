// App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import Create from './components/Create';
import Profile from './components/Profile';
import Reels from './components/Reels';
import Explore from './components/Explore';
import Search from './components/Search';
import Messages from './components/Messages';
import LogOut from './components/LogOut';
// import { ServerSocketProvider } from './components/ServerSocketProvider';
import PrivateRoutes from './utils/PrivateRoutes';
import PublicRoutes from './utils/PublicRoutes';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');

  return (
    <Router>
    {/* <ServerSocketProvider userId={userId} isLoggedIn={isLoggedIn}> */}
      <div className="App">
        
          <Routes>
             <Route element={<PrivateRoutes/>}>
                              <Route path="/home" element={<Home />} />
                              <Route path="/create" element={<Create />} />
                              <Route path="/profile" element={<Profile />} />
                              <Route path="/reels" element={<Reels />} />
                              <Route path="/explore" element={<Explore />} />
                              <Route path="/search" element={<Search />} />
                              <Route path="/messages" element={<Messages />} />
                              <Route path="/notifi" element={<Home />} />
                              <Route path="/logout" element={<LogOut setIsLoggedIn={setIsLoggedIn} />} />

             </Route>
             <Route element={<PublicRoutes/>}>
                             <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} setUserId={setUserId} />} />
                             <Route path="/reg_page" element={<Register />} />
             </Route>
           

          </Routes>
       
      </div>
      {/* </ServerSocketProvider> */}
    </Router>
  );
}

export default App;
