import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

import { fetchUser } from "@/app/lib/services/user";


export const metadata = {
  title: '設定'
}

export default async function Page() {
  const session = await auth()
  const email = session?.user?.email || ""

  const user = await fetchUser(null, email)
  if (!user) return redirect("/signup");

  const settings = [
    {
      title: "ツール",
      content: [
        { name: "固定スケジュール", icon: "calendar_today", href: "/settings/fixed-schedule", style: "" },
        { name: "使い方ガイド", icon: "help", href: "/help", style: "" }
      ]
    },
    {
      title: "アカウント",
      content: [
        { name: "アカウント設定", icon: "manage_accounts", href: "/settings/account", style: "" },
        { name: "ログアウト", icon: "logout", href: "/logout", style: "red-500 text-red-500" },
      ]
    }
  ];

  return (
    <div className="grow max-w-2xl mx-auto w-full p-6">
      <h1 className="text-3xl font-bold mb-6">設定</h1>

      <div className="space-y-8">
        {settings.map((group) => (
          <section key={group.title}>
            <h2 className="text-sm font-semibold text-gray-500 mb-2 ml-1">
              {group.title}
            </h2>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
              {group.content.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-4 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors ${index !== group.content.length - 1 ? "border-b border-zinc-100 dark:border-zinc-800" : ""
                    } ${item.style}`}
                >
                  <span className="material-symbols-outlined text-zinc-600 dark:text-zinc-300">{item.icon}</span>
                  <span className="grow font-medium">{item.name}</span>
                  <span className="material-symbols-outlined text-zinc-300 dark:text-zinc-600 text-sm">chevron_right</span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}