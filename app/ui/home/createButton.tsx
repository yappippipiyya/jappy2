import Link from "next/link";

export function CreateButton() {
  return (
    <Link
      href="/band/create"
      className="flex items-center justify-center mr-10 p-5 w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 hover:shadow-md transition-shadow"
    >
      <span className="material-icons text-yellow-400">add</span>
    </Link>
  );
}