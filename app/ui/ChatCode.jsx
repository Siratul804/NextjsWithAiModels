"use client";
import { useState } from "react";
import axios from "axios";

const CodeReviewer = () => {
  const [code, setCode] = useState(""); // State to store the code
  const [response, setResponse] = useState(null); // State to store the server response
  const [error, setError] = useState(null); // State to store errors
  const [loading, setLoading] = useState(false); // State to handle loading

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form default submission
    setLoading(true); // Set loading to true
    setError(null); // Reset errors
    setResponse(null); // Reset response

    try {
      const res = await axios.post("/api/code_review_groq", { code }); // Send POST request
      setResponse(res.data); // Set response on success
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong!"); // Handle errors
    } finally {
      setLoading(false); // Reset loading
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Code Reviewer</h1>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="code"
          >
            Paste Your Code:
          </label>
          <textarea
            id="code"
            rows="10"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Code"}
          </button>
        </div>
      </form>

      {/* Server Response */}
      {/* {response && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 w-full max-w-lg mb-4 rounded">
          <h2 className="font-bold">Server Response:</h2>
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )} */}

      {response && response.suggestions && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 w-full max-w-lg mb-4 rounded">
          <h2 className="font-bold">Suggestions:</h2>
          <ul className="list-disc list-inside">
            {response.suggestions.map((suggestion, index) => (
              <li key={index} className="mb-2">
                {suggestion.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 w-full max-w-lg mb-4 rounded">
          <h2 className="font-bold">Error:</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default CodeReviewer;
