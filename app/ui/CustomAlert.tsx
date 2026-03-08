"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type AlertOptions = {
  title: string;
  text?: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string; // Tailwindのクラス名 (bg-red-500など)
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold">{alert.title}</h2>
            {alert.text && <p className="mt-2 text-gray-600">{alert.text}</p>}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => handleClose(false)}
                className="rounded-md px-4 py-2 text-gray-600 hover:bg-gray-100"
              >
                {alert.cancelText || "キャンセル"}
              </button>
              <button
                onClick={() => handleClose(true)}
                className={`rounded-md px-4 py-2 text-white transition-colors ${
                  alert.confirmColor || "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {alert.confirmText || "OK"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error("useAlert must be used within AlertProvider");
  return context;
};