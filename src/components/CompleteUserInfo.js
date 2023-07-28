import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { Button } from "react-bootstrap";
import Signout from "./Signout";
import { getDocs, collection, addDoc } from "firebase/firestore";
import { async } from "q";

const CompleteUserInfo = ({ user }) => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [isStudent, setIsStudent] = useState(false);
  const [isInstructor, setIsInstructor] = useState(false);
  const [level, setLevel] = useState("");

  const usersCollectionRef = collection(db, "users");

  const handleSubmit = async(e) => {
    e.preventDefault();
   
      try {
        await addDoc(usersCollectionRef, {
          name: name,
          gender: gender,
          isStudent: isStudent,
          isInstructor: isInstructor,
          level: level,
        });
        if (isInstructor) {
        // Navigate to the InstructorProfile.js component
        navigate("/instructor-profile");
      } else {
        // Handle navigation for other user types if needed
      }
      } catch (err) {
        console.error("Error adding data:", err);
      }
   
  };

  return (
    <div>
      <h2>Welcome {user?.displayName || user?.email || "to SnowSage"}!</h2>
      <p>Please complete your basic information:</p>
      <form>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Gender:
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </label>
        <div>
          <label>
            I am a/an?
            <br />
            <Button
              variant={isStudent ? "success" : "outline-secondary"}
              onClick={() => {
                setIsStudent(true);
                setIsInstructor(false);
              }}>
              Student
            </Button>{" "}
            <Button
              variant={isInstructor ? "success" : "outline-secondary"}
              onClick={() => {
                setIsStudent(false);
                setIsInstructor(true);
              }}>
              Instructor
            </Button>
          </label>
        </div>

        <label>
          Ski/Snowboard Level:
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            required>
            <option value="">Choose your level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
        </label>
        <button type="submit" onClick={handleSubmit}>
          Submit
        </button>
      </form>
      <Signout />
    </div>
  );
};

export default CompleteUserInfo;
