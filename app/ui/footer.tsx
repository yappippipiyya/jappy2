"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  const NAV_ITEMS = [
    { to: "/", icon: "home", desc: "ホーム" },
    { to: "/schedule-manage", icon: "event_note", desc: "予定管理" },
    { to: "/settings", icon: "settings", desc: "設定" },
  ];

  return (
    <nav className="rounded-t-2xl fixed bottom-0 left-0 z-50 w-full border-t border-neutral-100 bg-white dark:border-neutral-700 dark:bg-neutral-800">
      <div className="flex">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.to;

          const activeColor = isActive
            ? "text-yellow-400"
            : "text-gray-900 dark:text-gray-100";

          return (
            <Link
              key={item.to}
              href={item.to}
              className={`w-full p-2.5 text-center transition-colors ${activeColor}`}
            >
              <span className="material-icons">
                {item.icon}
              </span>
              <div className="text-xs">
                {item.desc}
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}