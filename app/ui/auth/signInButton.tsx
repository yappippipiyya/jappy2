import { signIn } from "@/auth";
import { FcGoogle } from "react-icons/fc";

export function SignInButton() {
  return (
    <div className="">
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/" });
        }}
      >
        <button
          type="submit"
          className="flex items-center gap-3 rounded-full border border-gray-300 dark:bg-neutral-800 px-8 py-3 text-xl shadow-sm transition-all hover:shadow-md"
        >
          <FcGoogle className="h-8 w-8" />
          <span className="font-bold">Googleでログイン</span>
        </button>
      </form>
    </div>
  );
}