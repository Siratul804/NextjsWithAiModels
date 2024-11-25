"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

function HomePage({ chatRes }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);

    if (searchQuery) {
      params.set("q", searchQuery);
    } else {
      params.delete("q");
    }

    setTimeout(() => {
      replace(`${pathname}?${params}`);
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
        placeholder="Type your search query here minimum 6 words..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />
      <p className="py-1"></p>
      <button
        onClick={handleSearch}
        className={` w-full rounded-md p-1
        bg-black
        text-white`}
      >
        Submit Answer
      </button>

      <h1 className="font-bold text-black pt-2 "> Response : </h1>
      <p className="font-italic text-red-800 font-serif">{chatRes}</p>
    </div>
  );
}

export default HomePage;
