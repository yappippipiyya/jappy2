"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateAccount } from "@/app/lib/actions/user";
import { User } from "@/app/lib/types";
import { toast } from "sonner";

export default function AccountForm({ user }: { user: User }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;

    setSaved(false);

    startTransition(async () => {
      const res = await updateAccount(name);

      if (res) {
        toast.success("保存しました。");

        setSaved(true);
        router.refresh();

        setTimeout(() => {
          setSaved(false);
        }, 2000);
      } else {
        toast.error("更新に失敗しました。");
      }
    });
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

        <p className="mt-2 text-xs text-zinc-400 ml-1">
          メールアドレスは変更できません。
        </p>
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
              <div className="animate-spin h-5 w-5 border-2 border-zinc-500 border-t-transparent rounded-full"></div>
              保存中...
            </span>
          ) : saved ? (
            <span className="flex items-center gap-2">
              ✓ 保存しました
            </span>
          ) : (
            "保存する"
          )}
        </button>
      </div>

    </form>
  );
}