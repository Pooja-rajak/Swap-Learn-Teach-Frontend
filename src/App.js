import React, { useEffect, useState } from "react";
import "./App.css";
import SwapForm from "./SwapForm";
import SwapCard from "./SwapCard";
import RequestSwap from "../RequestSwap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const userId = "1";
  const [swaps, setSwaps] = useState([]);
  const [showSwapForm, setShowSwapForm] = useState(false);
  const [showRequestSwap, setshowRequestSwap] = useState(false);
  const [requestedSwap, setrequestedSwap] = useState([]);
  const [requestsSent, setRequestsSent] = useState({});

  // Fetch all skill swaps once on mount
  useEffect(() => {
    console.log("Fetching swaps...");
    fetch("https://s9v992-5000.csb.app/swaps")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched swaps:", data); // Log fetched data to check
        setSwaps(data);
      })
      .catch((err) => console.error("Error fetching swaps:", err));
  }, []); // Empty dependency array ensures this runs only once

  // Add new skill swap
  const addSwap = (newSwap) => {
    fetch("https://s9v992-5000.csb.app/swaps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSwap),
    })
      .then((res) => res.json())
      .then((added) => {
        console.log("Added new swap:", added); // Log added swap to check
        setSwaps((prev) => [...prev, added]);
      })
      .catch((err) => console.error("Error adding swap:", err));
  };

  // Fetch requests made by this user once on mount
  useEffect(() => {
    console.log("Fetching requests sent by user...");
    fetch("https://s9v992-5000.csb.app/RequestSwaps/" + userId)
      .then((res) => res.json())
      .then((data) => {
        const sentMap = {};
        data.forEach((request) => {
          sentMap[request.idSwap] = request; // Store full request object
        });
        console.log("Fetched requests with id:", sentMap); // Log requests to check
        setRequestsSent(sentMap);
      })
      .catch((err) => console.error("Error fetching request swaps:", err));
  }, []); // Empty dependency array ensures this runs only once

  // Send request for a skill swap
  const handleSendRequest = (swapId, requestType, swapuserId) => {
    const requestPayload = {
      idSwap: swapId,
      RequestType: requestType,
      requestDoneBY: userId,
      requestedFor: swapuserId,
    };

    fetch("https://s9v992-5000.csb.app/RequestSwaps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestPayload),
    })
      .then(async (res) => {
        const result = await res.json();
        if (!res.ok) {
          console.error("Backend error:", result);
          throw new Error(result.error || "Unknown error");
        }
        console.log("Request swap added:", result);
        setRequestsSent((prev) => ({
          ...prev,
          [swapId]: result,
        }));
        toast.success("Request sent successfully! 🚀");
      })
      .catch((err) => {
        console.error("Error sending request:", err);
        toast.error("Failed to send request.");
      });
  };
  // Fetch all Requestedskill swaps once on mount
  useEffect(() => {
    fetch("https://s9v992-5000.csb.app/RequestedSwaps/" + userId)
      .then((res) => res.json())
      .then((data) => {
        console.log(userId + "Fetched RequestedSwaps:", data); // Log fetched data to check
        setrequestedSwap(data);
      })
      .catch((err) => console.error("Error fetching swaps:", err));
  }, []); // Empty dependency array ensures this runs only once

  console.log("Rendering App component"); // Log whenever App is rendered

  return (
    <div className="app-container">
      <div className="header">
        <div className="heading">
          <h1>Skill Swap Board</h1>
        </div>
        <div className="nav">
          <div className="nav-button">
            <button
              className="create-button"
              onClick={() => {
                setShowSwapForm(!showSwapForm);
              }}
            >
              {showSwapForm ? "Close Form" : "Create New Swap"}
            </button>
          </div>
          <div className="nav-button">
            <button
              className="create-button"
              onClick={() => {
                setshowRequestSwap(!showRequestSwap);
              }}
            >
              {showRequestSwap ? "Close Requests" : "Check Requests"}
            </button>
          </div>
        </div>
      </div>

      <div className="Form">
        {showSwapForm && <SwapForm userId={userId} onAddSwap={addSwap} />}
      </div>
      <div className="Form">
        {showRequestSwap && <RequestSwap onRequestedSwap={requestedSwap} />}
      </div>

      <div className="card-container">
        {swaps.length === 0 ? (
          <div className="swap-card">No swaps available.</div>
        ) : (
          swaps.map((swap) => (
            <SwapCard
              key={swap.id}
              swap={swap}
              requestsSent={requestsSent}
              onSendRequest={handleSendRequest}
            />
          ))
        )}
      </div>

      <ToastContainer position="top-center" />
    </div>
  );
}

export default App;
