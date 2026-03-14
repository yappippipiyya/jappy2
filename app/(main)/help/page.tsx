"use client";

import Link from "next/link";

export default function HelpPage() {
  return (
    <div className="grow max-w-2xl mx-auto w-full p-6">
      <div className="flex items-center gap-2 mb-5">
        <Link
          href="/settings"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          <span className="material-symbols-outlined text-zinc-600 dark:text-zinc-400">arrow_back</span>
        </Link>
        <h1 className="mb-1 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          使い方ガイド
        </h1>
      </div>

      {/* アプリ説明 */}
      <div className="mb-8 p-5 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
          このアプリは、バンドメンバーの空き時間を共有して、バンド練の日程を決めやすくするためのスケジュール管理アプリです。
        </p>

        <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-3">
          基本の使い方
        </h2>

        <div className="grid sm:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
            <span className="material-symbols-outlined text-emerald-600 text-[18px]">
              group_add
            </span>
            バンドに参加
          </div>

          <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
            <span className="material-symbols-outlined text-sky-600 text-[18px]">
              edit_calendar
            </span>
            空き時間を入力
          </div>

          <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
            <span className="material-symbols-outlined text-orange-600 text-[18px]">
              event
            </span>
            バンド練の日程を決める
          </div>
        </div>
      </div>

      <div className="space-y-10 pb-12">
        {/* セクション: バンドへの参加 */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 p-2 rounded-lg">group_add</span>
            <h2 className="text-xl font-bold">バンドに参加</h2>
          </div>
          <div className="text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
            <p>まずはバンドに参加しましょう！</p>
            <p>招待リンクからバンドに参加するか、新しくバンドを作成・招待できます。</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="p-5 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <h3 className="font-bold mb-2 flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                <span className="material-symbols-outlined text-sm">join</span>
                参加する
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                招待リンクからバンドに参加します。バンドマスターに招待リンクを送ってもらってください。
              </p>
            </div>
            <div className="p-5 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <h3 className="font-bold mb-2 flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                <span className="material-symbols-outlined text-sm">add_circle</span>
                新しく作る
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                ホーム画面の「＋」からバンドを作成します。招待リンクをコピーし、SNS等でメンバーに共有してください。
              </p>
            </div>
          </div>
        </section>

        <hr className="border-zinc-100 dark:border-zinc-800" />

        {/* セクション: スケジュール入力 */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-sky-600 bg-sky-50 dark:bg-sky-900/30 p-2 rounded-lg">edit_calendar</span>
            <h2 className="text-xl font-bold">空き時間を入力</h2>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
            <Link href="/schedule-manage" className="text-sky-600 font-bold hover:underline italic">スケジュール管理画面</Link>の表にあるチェックボックスを操作して、自分の空き時間を登録します。
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-5 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <h3 className="font-bold mb-2 flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                <span className="text-xl">1. </span>
                デフォルトスケジュール
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                まずは「デフォルト」を選択し、普段空いている時間を入力しましょう。
                これはすべてのバンドの基本スケジュールになります。
              </p>
            </div>
            <div className="p-5 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <h3 className="font-bold mb-2 flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                <span className="text-xl">2. </span>
                バンドスケジュール
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                バンドごとに個別の予定を入力できます。<span className="font-bold">「デフォルトを適用」</span>を押すと、デフォルトの予定を一気に反映できます。
              </p>
            </div>

          <div className="bg-sky-50 dark:bg-sky-900/20 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4">
            <p className="text-xs text-sky-600 dark:text-sky-300 flex gap-2">
              <span className="material-symbols-outlined text-sm">info</span>
              バンド練が入っているセルをタップすると、どのバンドの練習が入っているか確認できます。
            </p>

            <hr className="border-zinc-100 dark:border-zinc-800 my-3" />

            <p className="text-xs text-sky-600 dark:text-sky-300 flex gap-2">
              <span className="material-symbols-outlined text-sm">info</span>
              行・列をタップすると、その行・列のチェックを一括で付け外しできます。
            </p>
          </div>
          </div>
        </section>

        <hr className="border-zinc-100 dark:border-zinc-800" />

        {/* セクション: バンド練の決定 */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-orange-500 bg-orange-50 dark:bg-orange-900/30 p-2 rounded-lg">event</span>
            <h2 className="text-xl font-bold">バンド練の日程を決める</h2>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
            各バンドページで、バンド練の日程を決定することができます。
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-5 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <h3 className="font-bold mb-2 flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                <span className="material-symbols-outlined">groups</span>
                みんなの予定確認モード
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                バンドメンバーの予定を確認することができます。各セルをタップすると、空いているメンバーの名前が表示されます。
              </p>
            </div>
            <div className="p-5 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <h3 className="font-bold mb-2 flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                <span className="material-symbols-outlined">edit_calendar</span>
                バンド練編集モード
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                バンドメンバーの予定をもとに、バンド練の時間帯を決定・入力できます。
              </p>
            </div>
          </div>
        </section>

        <hr className="border-zinc-100 dark:border-zinc-800" />

        {/* セクション: 固定スケジュール */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-lg">speed</span>
            <h2 className="text-xl font-bold">固定スケジュール</h2>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
            毎週決まった時間に予定がある場合、あらかじめ登録しておくことで一括入力が可能になります。
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-5 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <h3 className="font-bold mb-2 flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                <span className="text-xl">1. </span>
                固定スケジュールの入力
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                <Link href="/settings/fixed-schedule" className="text-sky-600 font-bold hover:underline italic">設定 ＞ 固定スケジュール</Link> から、1週間の固定の予定を入力します。
              </p>
            </div>
            <div className="p-5 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <h3 className="font-bold mb-2 flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                <span className="text-xl">2. </span>
                固定スケジュールの適用
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                スケジュール管理画面で<span className="font-bold">「固定スケジュールを適用」</span>を押すと、各週ごとに一気にチェックが入ります。
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
