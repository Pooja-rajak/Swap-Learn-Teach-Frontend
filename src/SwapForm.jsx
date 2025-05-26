import React from "react";
import "./SwapForm.css";
import { toast } from "react-toastify";

function SwapForm({ userId, onAddSwap }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const newSwap = {
      userid: userId,
      name: e.target.name.value,
      canTeach: e.target.canTeach.value,
      wantToLearn: e.target.wantToLearn.value,
      img:
        e.target.img.value ||
        "https://via.placeholder.com/300x100?text=Skill+Swap",
    };
    onAddSwap(newSwap);
    e.target.reset();

    toast.success("User created successfully! 🚀");
  };

  return (
    <form className="swap-form" onSubmit={handleSubmit}>
      <h2>Add a New Swap</h2>
      <input type="text" name="name" placeholder="Your Name" required />
      <input
        type="text"
        name="canTeach"
        placeholder="Skill You Can Teach"
        required
      />
      <input
        type="text"
        name="wantToLearn"
        placeholder="Skill You Want to Learn"
        required
      />
      <input type="text" name="img" placeholder="Image URL (optional)" />
      <button type="submit" className="swap-form-button">
        Add Swap
      </button>
    </form>
  );
}

export default SwapForm;
