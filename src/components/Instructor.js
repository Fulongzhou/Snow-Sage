import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const Instructor = ({ user }) => {
  const [instructorData, setInstructorData] = useState(null);

  useEffect(() => {
    const fetchInstructorData = async () => {
      if (user) {
        try {
          // Construct the instructor document reference based on the user's UID
          const instructorDocRef = doc(db, "instructors", user?.uid);

          // Get the instructor document from Firestore
          const docSnap = await getDoc(instructorDocRef);

          // If the document exists, set the instructor data state
          if (docSnap.exists()) {
            setInstructorData(docSnap.data());
          } else {
            console.log("Instructor data not found.");
          }
        } catch (error) {
          console.error("Error fetching instructor data:", error);
        }
      }
    };

    fetchInstructorData();
  }, [user]);

  return (
    <div>
      {instructorData ? (
        <>
          <h2>Instructor Profile</h2>
          <p>Name: {user.displayName}</p>
          <p>Title: {instructorData.title}</p>
          <p>Level: {instructorData.level}</p>
          <p>Resorts: {instructorData.resorts.join(", ")}</p>
          <p>Teaching Content: {instructorData.teachingContent}</p>
        </>
      ) : (
        <p>Loading instructor data...</p>
      )}
    </div>
  );
};

export default Instructor;

