import React, { useRef, useState } from "react";
import { auth, googleProvider, db } from "../firebase";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";

import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { Form, Button, Card, Alert } from "react-bootstrap";

export default function Signup() {
  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const nameRef = useRef();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
  
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      setError("Passwords do not match");
      return; // Return early if passwords don't match
    }
  
    const name = nameRef.current.value.trim();
    if (!name) {
      setError("Name cannot be empty");
      return; // Return early if name is empty
    }
  
    try {
      setError("");
      setLoading(true);
  
      // Create the user and log them in
      const { user: firebaseUser } = await createUserWithEmailAndPassword(
        auth,
        emailRef.current.value,
        passwordRef.current.value
      );
  
      // Update the user's profile with their name
      await updateProfile(firebaseUser, { displayName: name });
  
      // Create the "users" collection and add a document with user data
      const userData = {
        id: firebaseUser.uid,
        name: name,
        email: firebaseUser.email,
        // Add any additional user data you want to store in the collection
      };
  
      // Use addDoc to automatically generate a unique ID for the new document
      await setDoc(doc(db, "users", firebaseUser.uid), userData);
  
      navigate("/complete-userinfo");
    } catch (err) {
      setError("Failed to create an account: " + err.message);
    }
    setLoading(false);
  }

  const signInWithGoogle = async () => {
    try {
      const { user } = await signInWithPopup(auth, googleProvider);    
        navigate("/complete-userinfo");
    } catch (err) {
      setError("Failed to sign in with Google: " + err.message);
    }
  };

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group id="name">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" ref={nameRef} required />
            </Form.Group>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control type="password" ref={passwordConfirmRef} required />
            </Form.Group>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-100 mb-3"
              type="submit"
            >
              Sign Up
            </Button>
          </Form>
          <Button onClick={signInWithGoogle} className="w-100 mb-3">
            Sign In With Google
          </Button>
        </Card.Body>
      </Card>
    </>
  );
}







