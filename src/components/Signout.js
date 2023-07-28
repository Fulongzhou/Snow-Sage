import React from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { Button } from "react-bootstrap";

const Signout = () => {
  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Failed to log out: ", err.message);
    }
  };

  return (
    <Button onClick={logOut} className="w-100">
      Log Out
    </Button>
  );
};

export default Signout;
