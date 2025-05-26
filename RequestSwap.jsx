import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./RequestSwap.css";

function RequestSwap({ onRequestedSwap }) {
  const [mergedSwaps, setMergedSwaps] = useState([]);

  useEffect(() => {
    if (!Array.isArray(onRequestedSwap) || onRequestedSwap.length === 0) return;

    const fetchSwapPair = async (request) => {
      const { requestedFor, requestDoneBY, id } = request;

      try {
        const [mineRes, otherRes] = await Promise.all([
          fetch(`https://s9v992-5000.csb.app/swaps/mine/${requestedFor}`),
          fetch(`https://s9v992-5000.csb.app/swaps/other/${requestDoneBY}`),
        ]);

        const [mineData, otherData] = await Promise.all([
          mineRes.json(),
          otherRes.json(),
        ]);

        const mine = mineData[0] || {};
        const other = otherData[0] || {};

        return {
          id: id,
          name: other.name || "Unknown",
          canTeach: mine.canTeach || "N/A",
          wantToLearn: mine.wantToLearn || "N/A",
          img: other.img || "https://robohash.org/placeholder.png",
        };
      } catch (err) {
        console.error("Failed to fetch swap pair:", err);
        return {
          id,
          name: "Error",
          canTeach: "-",
          wantToLearn: "-",
          img: "https://robohash.org/error.png",
        };
      }
    };

    Promise.all(onRequestedSwap.map(fetchSwapPair)).then((merged) => {
      setMergedSwaps(merged);
    });
  }, [onRequestedSwap]);

  const handleAction = async (id, action) => {
    try {
      const response = await fetch(
        "https://s9v992-5000.csb.app/RequestSwaps/" + id + "/" + action,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Request failed");

      toast.success(
        `Request ${action === "Approved" ? "approved" : "rejected"}! 🚀`
      );
    } catch (error) {
      console.error("Error submitting action:", error);
      toast.error("Action failed. 😢");
    }
  };

  return (
    <>
      <table className="swap-form">
        <thead>
          <tr>
            <th>S.NO.</th>
            <th>Avatar</th>
            <th>Swap Person Name</th>
            <th>Teach</th>
            <th>Learn</th>
            <th>Approve/Reject</th>
          </tr>
        </thead>
        <tbody>
          {mergedSwaps.map((swap, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <img src={swap.img} alt="avatar" className="avatar" />
              </td>
              <td>{swap.name}</td>
              <td>{swap.canTeach}</td>
              <td>{swap.wantToLearn}</td>
              <td>
                <button
                  className="btn-approve"
                  onClick={() => handleAction(swap.id, "Approved")}
                >
                  ✅
                </button>
                <button
                  className="btn-reject"
                  onClick={() => handleAction(swap.id, "Rejected")}
                >
                  ❌
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}

export default RequestSwap;
