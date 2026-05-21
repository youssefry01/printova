import { FC } from 'react';
import Image from 'next/image';

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="flex flex-col items-center justify-center w-full py-2 lg:py-10 bg-linear-to-b from-[#5524B7] to-[#380B60] text-white/70">
      <Image className="size-24 lg:size-32" src="/logo.png" width={128} height={128} alt='logo' />
        <p className="text-sm lg:text-base my-2 text-center">Copyright © {currentYear} Printova. All rights reservered.</p>
    </footer>
  )
}

export default Footer;