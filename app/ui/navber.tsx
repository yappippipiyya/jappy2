import Image from 'next/image';
import Link from 'next/link';

export default function Navber() {
  return (
    <nav className="sticky top-0 z-50 flex items-center rounded-b-3xl bg-white dark:bg-zinc-800">
      <Link
        href="/"
        className="md:m-5 md:ml-7 m-4 ml-5"
      >
        <Image
          src="/jappy.png"
          width={140}
          height={0}
          alt="jappy logo"
          className="hidden md:block"
          />
        <Image
          src="/jappy.png"
          width={120}
          height={0}
          alt="jappy logo"
          className="md:hidden block"
        />
      </Link>
    </nav>
  )
}