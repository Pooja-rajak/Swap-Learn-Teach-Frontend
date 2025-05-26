import React from "react";
import "./SwapCard.css";
import { toast } from "react-toastify";

function SwapCard({ swap, requestsSent, onSendRequest }) {
  console.log(`Rendering SwapCard for swap ID: ${swap.id}`); // Log every time SwapCard is rendered

  // Determine requestType for the swap if exists
  const requestType = requestsSent[swap.id]
    ? requestsSent[swap.id].RequestType
    : null;

  console.log(`Request type for swap ID ${swap.id}:`, requestType);
  // Choose button class based on requestType
  const getButtonClass = () => {
    switch (requestType) {
      case "Pending":
        return "create-user-button pending";
      case "Approved":
        return "create-user-button approved";
      case "Rejected":
        return "create-user-button rejected";
      default:
        return "create-user-button"; // Default blue
    }
  };

  return (
    <div className="swap-card">
      <div className="card-body">
        <img className="card-image" src={swap.img} alt="header" />
        <h2 className="swap-title">{swap.name}</h2>
        <p className="swap-detail">
          <strong>Can Teach:</strong> {swap.canTeach}
        </p>
        <p className="swap-detail">
          <strong>Wants to Learn:</strong> {swap.wantToLearn}
        </p>

        <button
          className={getButtonClass()}
          onClick={() => {
            if (!requestType) {
              onSendRequest(swap.id, "Pending", swap.userid);
            }
          }}
          disabled={!!requestType} // Disable if request already sent
        >
          {requestType ? requestType : "Send Request"}
        </button>
      </div>
    </div>
  );
}

export default SwapCard;
