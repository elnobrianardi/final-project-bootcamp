"use client";

import { register } from "@/services/auth";
import React, { useState } from "react";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [role, setRole] = useState("");
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const fileList = e.target.files;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      setProfilePictureFile(file);
      const url = URL.createObjectURL(file);
      setProfilePictureUrl(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await register({
        email,
        name,
        password,
        passwordRepeat,
        role,
        profilePictureUrl,
        phoneNumber,
      });

    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        type="password"
      />
      <input
        value={passwordRepeat}
        onChange={(e) => setPasswordRepeat(e.target.value)}
        placeholder="Repeat Password"
        type="password"
      />

      <div>
        <label>
          <input
            type="radio"
            value="user"
            checked={role === "user"}
            onChange={(e) => setRole(e.target.value)}
          />
          User
        </label>
        <label>
          <input
            type="radio"
            value="admin"
            checked={role === "admin"}
            onChange={(e) => setRole(e.target.value)}
          />
          Admin
        </label>
      </div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {profilePictureUrl && (
        <div>Image selected: {profilePictureFile?.name}</div>
      )}
      <input
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Phone Number"
        type="number"
      />
      <button type="submit">Register</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default Register;
