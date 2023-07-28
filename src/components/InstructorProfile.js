import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { Button, Form, FormGroup, FormLabel, FormControl, Container, Row, Col } from "react-bootstrap";
import Signout from "./Signout";
import {  doc, setDoc, getDoc,updateDoc } from "firebase/firestore";

const InstructorProfile = ({ user }) => {
   const navigate=useNavigate();
  const [resorts, setResorts] = useState([]);
  const [title, setTitle] = useState("");
  const [teachingContent, setTeachingContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Update or create the instructor's profile in the database
    try {
        // Construct the instructor document reference based on the user's UID
        const instructorDocRef = doc(db, "instructors", user?.uid);
  
        // Update the document using setDoc()
        await setDoc(instructorDocRef, {
          resorts,
          title,
          teachingContent,
        });
        navigate("/instructor");
    } catch (err) {
      console.error(err);
    }
  };

  const handleResortChange = (e) => {
    const selectedResorts = Array.from(e.target.selectedOptions, (option) => option.value);
    setResorts(selectedResorts);
  };

  return (
    <Container>
      <Row>
        <Col xs={12} md={8}>
          <h2>Welcome, Instructor {user.displayName }!</h2>
          <p>Please complete your instructor profile:</p>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <FormLabel>Title:</FormLabel>
              <FormControl
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Teaching Content:</FormLabel>
              <FormControl
                as="textarea"
                value={teachingContent}
                onChange={(e) => setTeachingContent(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Resorts:</FormLabel>
              <FormControl
                as="select"
                multiple
                value={resorts}
                onChange={handleResortChange}
                required
              >
                <option value="resort1">Resort 1</option>
                <option value="resort2">Resort 2</option>
                <option value="resort3">Resort 3</option>
                {/* Add more resorts as needed */}
              </FormControl>
            </FormGroup>
            <Button type="submit">Save Profile</Button>
          </Form>
          <Signout />
        </Col>
      </Row>
    </Container>
  );
};

export default InstructorProfile;
