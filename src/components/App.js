import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import Signup from "./Signup";
import ProfileReview from "./ProfileReview";
import CompleteProfile from "./CompleteProfile";
import Home from "./Home";
import { Container } from "react-bootstrap";
import { auth } from "../firebase";
import Login from "./Login";
import Signout from "./Signout";
import Booking from "./Booking";
import './index.css'

function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserLoggedIn(!!user);
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Container>
        {userLoggedIn ? (
          <div className="w-100 mb-3">
            <Routes>
              <Route
                path="/complete-profile"
                element={<CompleteProfile user={user} />}
              />
              <Route
                path="/profile-review"
                element={<ProfileReview user={user} />}
              />
              <Route path="/student-book" element={<Booking user={user} />} />
              <Route
                path="/home-instructor"
                element={<ProfileReview user={user} />}
              />
              <Route path="/home" element={<Home user={user} />} />
            </Routes>
            <Signout />
          </div>
        ) : (
          <div>
            <div>
              <h1 className="title">SnowSage</h1>
            </div>
            <div>
              <Routes>
              <Route path="/" element={<Signup />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </div>
            <div className="front-bottom">
              <div className="front-bottom-item">
                <p>
                  New User? <NavLink to="/signup">Sign Up</NavLink>
                </p>
              </div>
              <div className="front-bottom-item">
                <p>
                  Already have an account? <NavLink to="/login">Log In</NavLink>
                </p>
              </div>
            </div>
          </div>
        )}
      </Container>
    </Router>
  );
}

export default App;
