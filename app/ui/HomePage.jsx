"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

function HomePage({ chatRes }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    setIsLoading(true); // Set loading to true before search starts
    const params = new URLSearchParams(searchParams);

    if (searchQuery) {
      if (searchQuery.length > 3) {
        params.set("q", searchQuery);
      }
    } else {
      params.delete("q");
    }

    setTimeout(() => {
      replace(`${pathname}?${params}`);
      setIsLoading(false); // Set loading to false after search completes
    }, 1000);
  };

  return (
    <div className="p-4">
      <h1 className="text-left py-2 text-xl font-bold font-mono">
        Ask me anything
      </h1>
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2"
        rows="3"
        placeholder="Type your search query here..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />
      <p className="py-1"></p>
      <button
        onClick={handleSearch}
        disabled={isLoading}
        className={`w-full py-1 px-4 rounded ${
          isLoading ? "bg-gray-500" : "bg-black"
        } text-white`}
      >
        {isLoading ? "Response..." : "Submit"}
      </button>

      <h1 className="font-bold text-black pt-2 "> Response : </h1>
      <p className="font-italic text-red-800 font-serif">
        {chatRes.length === 0 ? "No response yet" : chatRes}
      </p>
    </div>
  );
}

export default HomePage;
