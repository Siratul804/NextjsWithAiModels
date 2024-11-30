import "./globals.css";
import Navbar from "./ui/Navbar";
export const metadata = {
  title: "ChatWithAI",
  description:
    "A multitude of AI chatbots leveraging the Ollama LLM model, Langchain.js, and Next.js for advanced AI and machine learning applications",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
