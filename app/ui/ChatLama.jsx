"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

function ChatLama({ chatRes }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  console.log(chatRes);

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
        Hey ! Want to know something?
      </h1>
      <textarea
        className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 "
        rows="4"
        placeholder="Type your query here..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      ></textarea>

      <span className="py-4"></span>

      <button
        onClick={handleSearch}
        className="w-full bg-black text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 "
      >
        Submit Query
      </button>

      <h1 className="font-bold text-black pt-2 "> Response : </h1>
      <p className="font-italic text-red-800 font-serif">{chatRes}</p>
    </div>
  );
}

export default ChatLama;
