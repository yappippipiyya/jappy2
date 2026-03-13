import { SignInButton } from "@/app/ui/auth/signInButton";
import Image from 'next/image';


export const metadata = {
  title: 'Jappy ログイン',
  description: '予定管理ツールです。ログインが必要です。'
}

export default async function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <div>
        <Image
          src="/jappy.png"
          width={400}
          height={300}
          alt="jappy logo"
        />
      </div>
      <div className="py-8">
        <SignInButton />
      </div>
    </main>
  );
}