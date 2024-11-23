import HomePage from "./ui/HomePage";
import { ResLama } from "@/app/lib/llm";
async function page({ searchParams }) {
  const q = (await searchParams)?.q || "";
  console.log(q);
  const res = await ResLama(q);

  console.log(res);
  return (
    <>
      <HomePage chatRes={res} />
    </>
  );
}

export default page;
