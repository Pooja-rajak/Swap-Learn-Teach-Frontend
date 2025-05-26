import React from "react";
import "./User.css";
import { toast } from 'react-toastify';

function UserForm({onAddUser}){
const handleSubmit =(e) =>{
  e.preventDefault();
  const newUser = {
    name: e.target.name.value,
    email: e.target.email.value,
    password: e.target.password.value,
    img:e.target.img.value
  };
  onAddUser(newUser);
  e.target.reset();

  toast.success("User created successfully! 🚀");
};
  return (
    <form className="swap-form" onSubmit={handleSubmit}>
      <h2>Add a New User</h2>
      <input type="text" name="name" placeholder="Your Name" required />
      <input
        type="email"
        name="email"
        placeholder="Your Email"
        required
      />
      <input
        type="text"
        name="Password"
        placeholder="Keep it strong"
        required
      />
      <input type="text" name="img" placeholder="Image URL (optional)" />
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default UserForm;