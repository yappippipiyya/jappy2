"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { handleSignOut } from "@/app/lib/actions/handleSignOut";
import { deleteAccount } from "@/app/lib/actions/user";
import { useAlert } from "@/app/ui/CustomAlert";


export default function AccountDeleteButton() {
  const router = useRouter();
  const { fire } = useAlert();

  const handleDeleteAccount = async () => {
    const result = await fire({
      title: "アカウント削除",
      text: "本当にアカウントを削除してもよろしいですか？",
      description: "この操作は取り消せません。すべてのデータが完全に削除されます。",
      materialIconName: "delete",
      confirmText: "アカウント削除",
      confirmColor: "text-red-500 border-red-500",
    });

    if (!result.isConfirmed) return;

    const success = await deleteAccount();

  if (success) {
    toast.success("アカウントを削除しました。");
    setTimeout(async () => {
      await handleSignOut();
      router.push("/");
      router.refresh();
    }, 500);

  } else {
      toast.error("アカウントの削除に失敗しました。");
    }
  };

  return (
    <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4 mt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-red-700">危険な操作</h3>
          <p className="text-sm text-red-600">
            アカウントを削除すると、元に戻すことはできません。
          </p>
        </div>
        <button
          onClick={handleDeleteAccount}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md transition-colors font-medium shadow-sm"
        >
          アカウントを削除する
        </button>
      </div>
    </div>
  );
}