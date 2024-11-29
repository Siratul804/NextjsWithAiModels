"use client";
import { useState } from "react";

const ChatCat = () => {
  const [query, setQuery] = useState("");
  const [chatRes, setChatRes] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const submitData = async () => {
    setIsLoading(true); // Start loading
    setChatRes(""); // Clear previous response
    try {
      const response = await fetch("/api/chatCat", {
        method: "POST",
        body: JSON.stringify({ query }),
        headers: { "Content-Type": "application/json" },
        cache: "force-cache",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      const result = await response.json();
      console.log(result.data);
      setChatRes(result.data || "No response"); // Adjust key based on API response structure
    } catch (error) {
      console.error("Error:", error);
      setChatRes("An error occurred while fetching the response.");
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <div className="p-4 flex justify-center">
      <div className="w-full bg-white rounded-lg">
        <h1 className="text-left py-2 text-xl font-bold font-mono">
          Hey! Tell me, what's your cat eats every day?
        </h1>
        <div>
          {/* Textarea Input */}
          <textarea
            className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
            rows="4"
            placeholder="Type your query here..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading} // Disable input during loading
          ></textarea>

          {/* Submit Button */}
          <button
            onClick={submitData}
            type="button"
            className={`w-full bg-black text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading} // Disable button during loading
          >
            {/* {isLoading ? "Submitting..." : "Submit Query"} */}
            Submit Query
          </button>
        </div>
        <div className="pt-2">
          <b>Response:</b>
          {isLoading ? ( // Show loading spinner or message
            <p>Loading...</p>
          ) : (
            <p>{chatRes}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatCat;
