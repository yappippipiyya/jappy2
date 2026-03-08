"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateAccount } from "@/app/lib/actions/user";
import { User } from "@/app/lib/types";


export default function AccountForm({ user }: { user: User }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;

    setIsPending(true);

    const res = await updateAccount(name);

    if (res) {
      router.refresh();
    } else {
      alert("更新に失敗しました");
    }
    setIsPending(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 名前 */}
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-zinc-500 mb-2 ml-1">
          名前
        </label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={user.name || ""}
          className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-zinc-500 outline-none transition-all"
          required
        />
      </div>

      {/* メールアドレス */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-zinc-500 mb-2 ml-1">
          メールアドレス
        </label>
        <input
          type="email"
          id="email"
          name="email"
          defaultValue={user?.email ?? ""}
          className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 cursor-not-allowed outline-none"
          readOnly
          tabIndex={-1}
        />
        <p className="mt-2 text-xs text-zinc-400 ml-1">メールアドレスは変更できません。</p>
      </div>

      <hr className="border-zinc-100 dark:border-zinc-800" />

      {/* 送信ボタン */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 px-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              保存中...
            </span>
          ) : (
            "保存する"
          )}
        </button>
      </div>
    </form>
  );
}