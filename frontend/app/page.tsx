"use client";

import HomeFeed from "@/components/Home/HomeFeed";
import usePart from "@/hooks/usePart";

export default function Home() {
  const { parts } = usePart();
  
  return (
    <main className='flex flex-col bg-[#f7f7f8] grow w-full mt-20 dark:bg-indigo-950 z-50 font-family-poppins'>
      <HomeFeed parts={parts || []}/>
    </main>
  );
}