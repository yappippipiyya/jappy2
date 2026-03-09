"use client";
import { createContext, useContext, useState, ReactNode } from "react";


type AlertOptions = {
  title: string;
  text?: string;
  description?: string;
  materialIconName?: string;
  confirmText?: string;
  confirmColor?: string;
};

type AlertContextType = {
  fire: (options: AlertOptions) => Promise<{ isConfirmed: boolean }>;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);


export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<(AlertOptions & { resolve: (val: any) => void }) | null>(null);

  const fire = (options: AlertOptions) => {
    return new Promise<{ isConfirmed: boolean }>((resolve) => {
      setAlert({ ...options, resolve });
    });
  };

  const handleClose = (isConfirmed: boolean) => {
    if (alert) {
      alert.resolve({ isConfirmed });
      setAlert(null);
    }
  };

  return (
    <AlertContext.Provider value={{ fire }}>
      {children}
      {alert && (
        <>
          <style>{`
            @keyframes overlayShow {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes contentShow {
              from { opacity: 0; transform: scale(0.95) translateY(10px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}</style>

          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            style={{ animation: "overlayShow 0.2s ease-out" }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleClose(false);
              }
            }}
          >
            <div
              className="w-full max-w-110 rounded-xl bg-white dark:bg-zinc-950 shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
              style={{ animation: "contentShow 0.2s cubic-bezier(0.16, 1, 0.3, 1)" }}
            >

              {/* Header */}
              <div className="flex items-center justify-between px-4 py-2 border-b-2 border-zinc-200 dark:border-zinc-800">
                <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-100">{alert.title}</h2>
                <button
                  onClick={() => handleClose(false)}
                  className="text-zinc-400 hover:text-zinc-600 dark:text-zinc-600 dark:hover:text-zinc-400 p-1 transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col items-center text-center gap-5">
                {alert.materialIconName && (
                  <div className="text-zinc-400 dark:text-zinc-600">
                    <span className="material-symbols-outlined text-7xl!">{alert.materialIconName}</span>
                  </div>
                )}

                <div className="my-1">
                  <h3 className="text-xl font-bold text-zinc-950 dark:text-zinc-100 my-1">{alert.text}</h3>
                  <h4 className=" text-zinc-500">{alert.description}</h4>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleClose(true)}
                  className={`w-full py-2.5 px-4 rounded-lg border bg-zinc-50 dark:bg-black hover:bg-zinc-100 dark:hover:bg-zinc-900 font-semibold transition-all shadow-sm active:scale-[0.98] ${alert.confirmColor || "text-zinc-950 dark:text-zinc:100 border-zinc-300 dark:border-zinc-700"}`}
                >
                  {alert.confirmText || "OK"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error("useAlert must be used within AlertProvider");
  return context;
};