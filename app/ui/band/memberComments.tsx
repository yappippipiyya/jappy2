import { Band, Schedule, User } from "@/app/lib/types";


export function MemberComments({ band, schedules, bandUsers }: { band: Band; schedules: Schedule[]; bandUsers: User[] }) {
  const commentsData = bandUsers.map(user => {
    const userSchedule = schedules.find(
      s => Number(s.user_id) === user.id && Number(s.band_id) === band.id
    );
    return {
      user,
      comment: userSchedule?.comment || ""
    };
  }).filter(data => data.comment.trim() !== "");

  if (commentsData.length === 0) return null;

  return (
    <div className="mx-auto max-w-4xl mt-8 px-5 mb-16">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-5 pb-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
          <span className="material-icons text-[20px] text-zinc-500">forum</span>
          メンバーのコメント
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {commentsData.map(({ user, comment }) => (
            <div key={user.id} className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800/80">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                  {user.name?.[0] || "?"}
                </div>
                <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  {user.name || "不明なユーザー"}
                </div>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap ml-8">
                {comment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
