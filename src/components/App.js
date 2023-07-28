import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import Signup from "./Signup";
import InstructorProfile from "./InstructorProfile";
import CompleteUserInfo from "./CompleteUserInfo";
import Instructor from "./Instructor";
import { Container } from "react-bootstrap";
import { auth } from "../firebase";
import Login from "./Login";

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
                path="/complete-userinfo"
                element={<CompleteUserInfo user={user} />}
              />
              <Route
                path="/instructor-profile"
                element={<InstructorProfile user={user} />}
              />
              <Route
                path="/instructor"
                element={<Instructor user={user}/>}
              />
            </Routes>
          </div>
        ) : (
          <div>
            <div className="title">
              <h1>SnowSage</h1>
            </div>
            <div>
              <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </div>
            <div>
              <p>
                New User? <NavLink to="/signup">Sign Up</NavLink>
              </p>
            </div>
            <div>
              <p>
                Already have an account? <NavLink to="/login">Log In</NavLink>
              </p>
            </div>
          </div>
        )}
      </Container>
    </Router>
  );
}

export default App;
