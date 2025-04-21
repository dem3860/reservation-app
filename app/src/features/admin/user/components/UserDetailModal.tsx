"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { UserView } from "../types/view";
import { X } from "lucide-react";

type Props = {
  user: UserView | null;
  onClose: () => void;
};

export function UserDetailModal({ user, onClose }: Props) {
  return (
    <Dialog open={!!user} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="relative bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            aria-label="閉じる"
          >
            <X className="w-5 h-5" />
          </button>

          <DialogTitle className="text-2xl font-bold text-gray-800 mb-6 text-center">
            ユーザー詳細
          </DialogTitle>

          <div className="space-y-4 text-sm text-gray-700">
            <DetailItem label="名前" value={user?.name ?? ""} />
            <DetailItem label="メール" value={user?.email ?? ""} />
            <DetailItem
              label="住所"
              value={`${user?.prefecture ?? ""}${user?.city ?? ""}`}
            />
            <DetailItem label="性別" value={user?.gender ?? ""} />
            <DetailItem label="誕生日" value={user?.birthday ?? ""} />
            <DetailItem label="権限" value={user?.role ?? ""} />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="font-medium text-gray-600">{label}：</span>
      <span className="ml-1">{value}</span>
    </div>
  );
}
