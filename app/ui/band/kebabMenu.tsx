"use client";

import { useState } from "react";

export function KebabMenu({ isCreator, isArchived }: { isCreator: boolean, isArchived: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    isArchived
      ? { icon: "unarchive", text: "アーカイブ解除" }
      : { icon: "archive", text: "アーカイブ" },
    ...(isCreator
      ? [
          { icon: "edit", text: "編集する" },
          { icon: "delete", text: "削除する" },
        ]
      : [{ icon: "logout", text: "脱退する" }]),
  ];

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-full"
      >
        <span className="material-icons">more_vert</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>

          <ul className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 border border-gray-200 rounded-md shadow-lg z-20 py-1">
            {menuItems.map((item, i) => (
              <li
                key={i}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => setIsOpen(false)}
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