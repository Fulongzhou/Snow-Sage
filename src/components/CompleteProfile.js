import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { Button, Form } from "react-bootstrap";
import {
  collection,
  getDocs,
  setDoc,
  addDoc,
  doc,
  updateDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import "./index.css";

const CompleteProfile = ({ user }) => {
  const navigate = useNavigate();

  const [newResort, setNewResort] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [gender, setGender] = useState("");
  const [isStudent, setIsStudent] = useState(false);
  const [isInstructor, setIsInstructor] = useState(false);
  const [level, setLevel] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [resorts, setResorts] = useState([]);
  const [resortsData, setResortsData] = useState([]);

  // Load user data if it exists in Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.uid) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setGender(userData.gender || "");
          setIsStudent(userData.isStudent || false);
          setIsInstructor(userData.isInstructor || false);
          setLevel(userData.level || "");
          setTitle(userData.title || "");
          setContent(userData.content || "");
          setResorts(userData.resorts || []);
        }
      }
    };
    const fetchResortsData = async () => {
      try {
        const resortsQuerySnapshot = await getDocs(collection(db, "resorts"));
        const resortsData = resortsQuerySnapshot.docs.map(
          (doc) => doc.data().name
        );
        setResortsData(resortsData);
      } catch (error) {
        console.error("Error fetching resorts data:", error);
      }
    };

    const unsubscribe = onSnapshot(collection(db, "resorts"), () => {
      // When there are changes in the resorts collection, fetch the data again
      fetchResortsData();
    });

    if (user && user.uid) {
      fetchResortsData();
    }
    fetchUserData();
    fetchResortsData();
    // Unsubscribe the snapshot listener when the component unmounts
    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create a reference to the user document in Firestore based on the uid
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        // If user document exists, update the existing document
        await updateDoc(userDocRef, {
          gender: gender,
          isStudent: isStudent,
          isInstructor: isInstructor,
          level: level,
          title: title,
          content: content,
          resorts: resorts,
        });
      } else {
        // If user document doesn't exist, create a new document
        await setDoc(userDocRef, {
          gender: gender,
          isStudent: isStudent,
          isInstructor: isInstructor,
          level: level,
          title: title,
          content: content,
          resorts: resorts,
        });
      }

      navigate("/profile-review");
    } catch (err) {
      console.error("Error adding/updating data:", err);
    }
  };

  const handleResortChange = (resortName) => {
    setResorts((prevResorts) =>
      prevResorts.includes(resortName)
        ? prevResorts.filter((resort) => resort !== resortName)
        : [...prevResorts, resortName]
    );
  };
  const handleCreateResort = async () => {
    try {
      // Add the new resort to the resorts collection
      const newResortRef = await addDoc(collection(db, "resorts"), {
        name: newResort,
      });
      setNewResort("");
      // Hide the create form after creating the resort
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error adding new resort:", error);
    }
  };

  return (
    <div className="contaniner">
      <h2 className="title">Welcome {user?.name || "to SnowSage"}!</h2>
      <div className="form-container">
        <Form className="form">
          <p className="form-content">
            Please complete your basic information:
          </p>
          <label className="form-content">
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
          <br />
          <label className="form-content">
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
          <div>
            <label className="form-content">
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
          <div>
            {isStudent === true ? null : (
              <>
                <div className="form-content">
                  Title:{" "}
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="form-content">
                  Teaching Content:{" "}
                  <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  />
                </div>
                <div className="form-content">
                  <p>Choose one or more available resorts for you:</p>
                  {resortsData.map((resort) => (
                    <div key={resort}>
                      <input
                        type="checkbox"
                        checked={resorts.includes(resort)}
                        onChange={() => handleResortChange(resort)}
                      />
                      <label>{resort}</label>
                    </div>
                  ))}
                  <p>
                    No available resorts?{" "}
                    <span
                      className="resort-create"
                      onClick={() => setShowCreateForm(true)}>
                      Create one!
                    </span>
                  </p>
                  {showCreateForm && (
                    <div>
                      <input
                        type="text"
                        value={newResort}
                        onChange={(e) => setNewResort(e.target.value)}
                        placeholder="Enter new resort name"
                      />&nbsp;&nbsp;
                      <button onClick={handleCreateResort}>Create one</button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          <Button className="submit" type="submit" onClick={handleSubmit} style={{ fontSize: "15px", padding: "7px 183px" }}>
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default CompleteProfile;
