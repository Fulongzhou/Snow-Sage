import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { Button } from "react-bootstrap";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";
import { Link } from "react-router-dom";

const Booking = () => {
  const [searchResort, setSearchResort] = useState("");
  const [usersWithResort, setUsersWithResort] = useState([]);
  const [messages, setMessages] = useState(usersWithResort.map(() => ""));
  const [showMessageInput, setShowMessageInput] = useState(
    usersWithResort.map(() => false)
  );
  const [resortsList, setResortsList] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Function to fetch the list of available resorts from Firestore
    const fetchResortsList = async () => {
      try {
        const resortsQuerySnapshot = await getDocs(collection(db, "resorts"));
        const resortsData = resortsQuerySnapshot.docs.map(
          (doc) => doc.data().name
        );
        setResortsList(resortsData);
      } catch (error) {
        console.error("Error fetching resorts list:", error);
      }
    };
    // fetch current student profile
    const fetchCurrentStudent = async () => {
      try {
        const studentId = auth.currentUser.uid;
        const docRef = doc(db, "users", studentId);
        const docSnap = await getDoc(docRef);
        // console.log(docSnap.data());
        if (docSnap.exists()) {
          setCurrentUser(docSnap.data());
        } else {
          console.log("Document does not exist");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchCurrentStudent();
    fetchResortsList();
  }, []);

  const handleSendMessage = async (userIndex) => {
    const instructor = usersWithResort[userIndex];

    const selectedDate = `${selectedMonth} ${selectedDay}, ${selectedYear}, at ${selectedTime}`;
    const instructorMessage = `You have a scheduled appointment with ${currentUser.name} at ${searchResort} on ${selectedDate}. For further information, please contact ${currentUser.name} via email at "${currentUser.email}".`;
    const currentUserMessage = `You have a scheduled appointment with ${instructor.name} at ${searchResort} on ${selectedDate}. For further information, please contact ${instructor.name} via email at "${instructor.email}".`;
    // update message to instructor
    if (instructor) {
      try {
        const userRef = doc(db, "users", instructor.id);
        await updateDoc(userRef, { message: arrayUnion(instructorMessage) });
      } catch (err) {
        console.error(err);
      }
      // update message to current student
      if (currentUser) {
        try {
          const currentUserRef = doc(db, "users", currentUser.id);
          await updateDoc(currentUserRef, {
            message: arrayUnion(currentUserMessage),
          });
        } catch (err) {
          console.error(err);
        }
      }

      // Clear the input field after sending the message
      const instructorMessages = [...messages];
      instructorMessages[userIndex] = "";
      setMessages(instructorMessages);

      // Hide the input after sending the message
      const instructorShowMessageInput = [...showMessageInput];
      instructorShowMessageInput[userIndex] = false;
      setShowMessageInput(instructorShowMessageInput);
    } else {
      console.error("Invalid user or missing message property.");
    }
  };

  const handleSearch = async () => {
    try {
      // Query to get users with the searched resort in their resorts array
      const usersQuerySnapshot = await getDocs(
        query(
          collection(db, "users"),
          where("resorts", "array-contains", searchResort)
        )
      );

      // Collect the users' data who have the searched resort in their resorts array
      const usersData = usersQuerySnapshot.docs.map((doc) => doc.data());

      // Set the state with the found users
      setUsersWithResort(usersData);
    } catch (error) {
      console.error("Error searching for users:", error);
    }
  };

  return (
    <div>
      <h2 className="title">Book an Instructor</h2>
      <div className="front-top-link">
        <Link to="/home">Home</Link>
        <Link to="/student-book">Book</Link>
        <Link to="/profile-review">Profile</Link>
      </div>
      <div className="search-button">
        <select
          value={searchResort}
          onChange={(e) => setSearchResort(e.target.value)}>
          <option value="">Select a Resort</option>
          {resortsList.map((resort) => (
            <option key={resort} value={resort}>
              {resort}
            </option>
          ))}
        </select>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Button style={{ fontSize: "9px", padding: "5px 15px" }} onClick={handleSearch}>Search</Button>
      </div>
      {usersWithResort.length > 0 ? (
        <div className="booking-content">
          <h3>Instructors availiable at the resort:</h3>
          <ul>
            {usersWithResort.map((user, index) => (
              <li key={user.uid}>
                <h4><strong>Name:</strong> {user.name}{" "}</h4>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Gender:</strong> {user.gender}</p>
                <p><strong>Title:</strong> {user.title}</p>
                <p><strong>Level:</strong> {user.level}</p>
                <p><strong>Teaching Content:</strong> {user.content}</p>
                <Button className="message-button"
                  onClick={() =>
                    setShowMessageInput((prevShowMessageInput) => {
                      const instructorShowMessageInput = [
                        ...prevShowMessageInput,
                      ];
                      instructorShowMessageInput[index] = true;
                      return instructorShowMessageInput;
                    })
                  }>
                  Send Message
                </Button><br/>
                {/* Input to write the message */}
                {showMessageInput[index] && (
                  <>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}>
                      <option value="">Select a Month</option>
                      <option value="January">January</option>
                      <option value="February">February</option>
                      <option value="March">March</option>
                      <option value="April">April</option>
                      <option value="May">May</option>
                      <option value="June">June</option>
                      <option value="July">July</option>
                      <option value="August">August</option>
                      <option value="September">September</option>
                      <option value="October">October</option>
                      <option value="November">November</option>
                      <option value="December">December</option>
                    </select>
                    <select
                      value={selectedDay}
                      onChange={(e) => setSelectedDay(e.target.value)}>
                      <option value="">Select Day</option>
                      {Array.from({ length: 31 }, (_, index) => index + 1).map(
                        (day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        )
                      )}
                    </select>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}>
                      <option value="">Select Year</option>
                      <option value="2023">2023</option>
                      <option value="2024">2024</option>
                    </select>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}>
                      <option value="">Select Time</option>
                      <option value="9 AM">9 AM</option>
                      <option value="10 AM">10 AM</option>
                      <option value="11 AM">11 AM</option>
                      <option value="12 PM">12 PM</option>
                      {Array.from({ length: 9 }, (_, index) => index + 1).map(
                        (time) => (
                          <option key={time} value={time}>
                            {time} PM
                          </option>
                        )
                      )}
                    </select>&nbsp;
                    <Button style={{ fontSize: "9px", padding: "5px 15px", marginBottom:"30px" }} onClick={() => handleSendMessage(index)}>
                      Send
                    </Button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="booking-buttom">No instructors found with the selected resort.</p>
      )}
    </div>
  );
};

export default Booking;
