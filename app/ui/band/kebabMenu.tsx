"use client";

import { useState } from "react";

import { updateBandArchiveStatus, leaveBand, deleteBand } from "@/app/lib/actions/band";
import { useRouter } from "next/navigation";
import { Band } from "@/app/lib/types";


export function KebabMenu({ band, isCreator, isArchived }: { band: Band, isCreator: boolean, isArchived: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleArchive = async () => {
    const success = await updateBandArchiveStatus(band.id, !isArchived);
    if (success) {
      router.push("/");
    }
  };

  const deleteTheBand = async () => {
    const success = await deleteBand(band.id);
    if (success) {
      router.push("/")
    }
  }

  const leaveTheBand = async () => {
    const success = await leaveBand(band.id);
    if (success) {
      router.push("/");
    }
  }

  const menuItems = [
    isArchived
      ? { icon: "unarchive", text: "アーカイブ解除", onClick: handleArchive, color: "text-zinc-700 dark:text-zinc-200" }
      : { icon: "archive", text: "アーカイブ", onClick: handleArchive, color: "text-zinc-700 dark:text-zinc-200" },
    ...(isCreator
      ? [
          { icon: "edit", text: "編集する", onClick: () => {router.push(`/band/${band.token}/edit`)}, color: "text-zinc-700 dark:text-zinc-200" },
          { icon: "delete", text: "削除する", onClick: deleteTheBand, color: "text-red-500" },
        ]
      : [{ icon: "logout", text: "脱退する", onClick: leaveTheBand, color: "text-yellow-500" }]),
  ];

  return (
    <div className="absolute right-0 mr-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center p-2 w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 hover:shadow-md transition-shadow"
      >
        <span className="material-icons text-yellow-400">more_horiz</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>

          <ul className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-700 rounded-md shadow-lg z-20 py-1">
            {menuItems.map((item, i) => (
              <li
                key={i}
                className={`flex gap-3 px-4 py-2 text-sm ${item.color} hover:bg-gray-100 cursor-pointer`}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
              >
                <span className="material-icons">{item.icon}</span>
                {item.text}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}