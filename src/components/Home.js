import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

const Home = () => {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [cancelClickedIndex, setCancelClickedIndex] = useState(null);

  useEffect(() => {
    // Function to fetch user data from Firestore based on UID
    const fetchUser = async () => {
      try {
        const userId = auth.currentUser.uid;
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUser(docSnap.data());
        } else {
          console.log("Document does not exist");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (user && Array.isArray(user.message)) {
      setAppointments(user.message);
    }
  }, [user]);

  const handleCancelAppointment = async (appointmentIndex) => {
    if (user && Array.isArray(user.message)) {
      try {
        const updatedAppointments = [...appointments];
        updatedAppointments.splice(appointmentIndex, 1);
        const userRef = doc(db, "users", user.id);
        await updateDoc(userRef, { message: updatedAppointments });
        setAppointments(updatedAppointments);
        setCancelClickedIndex(null); // Reset the cancelClickedIndex
      } catch (error) {
        console.error("Error removing appointment:", error);
      }
    }
  };

  return (
    <div>
      <h2 className="title">Welcome {user?.name}!</h2>
      <div className="front-top-link">
        <Link to="/home">Home</Link>
        {user?.isStudent ? <Link to="/student-book">Book</Link> : ""}
        <Link to="/profile-review">Profile</Link>
      </div>
      <div className="home-view">
        <p className="list">Your Appointment List:</p>
        {appointments.length > 0 ? (
          <ul>
            {appointments.map((appointment, index) => (
              <li key={index}>
                <p>{appointment}</p>
                {cancelClickedIndex === index && (
                  <div>
                    <p style={{ color: "red" }}>
                      Before canceling the appointment, please notify the other
                      party via email.
                    </p>
                    <Button className="btn btn-danger" onClick={() => handleCancelAppointment(index)}>
                      Confirm Cancellation
                    </Button>
                  </div>
                )}
                {cancelClickedIndex !== index && (
                  <Button className="btn btn-danger" onClick={() => setCancelClickedIndex(index)}>
                    Cancel
                  </Button>
                )}
              </li>      
            ))}
          </ul>
        ) : (
          <p>No appointments scheduled.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
