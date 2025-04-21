"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import { useListUsers } from "@/api/generated/api";
import { UserSearchFilter } from "./components/UserSearchFilter";
import { UserTable } from "./components/UserTable";
import { Pagination } from "@/components/ui/Pagenation";
import {
  formatDateToJapanese,
  formatGender,
  formatRole,
} from "@/features/admin/user/util";
import { UserView } from "@/features/admin/user/types/view";
import { UserDetailModal } from "./components/UserDetailModal";

export default function AdminUserPageImpl() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const birthDayFrom = searchParams.get("birthDayFrom") ?? "";
  const birthDayTo = searchParams.get("birthDayTo") ?? "";
  const page = parseInt(searchParams.get("page") ?? "1", 10) || 1;
  const limit = parseInt(searchParams.get("limit") ?? "10", 10) || 10;

  const [debouncedQ] = useDebounce(q, 500);
  const [debouncedBirthDayFrom] = useDebounce(birthDayFrom, 500);
  const [debouncedBirthDayTo] = useDebounce(birthDayTo, 500);

  const normalizeDateTime = (input: string) =>
    input ? new Date(input).toISOString() : undefined;

  const { data, error } = useListUsers(
    {
      q: debouncedQ,
      birthDayFrom: normalizeDateTime(debouncedBirthDayFrom),
      birthDayTo: normalizeDateTime(debouncedBirthDayTo),
      page: page.toString(),
      limit: limit.toString(),
    },
    {
      query: {
        queryKey: [
          "user",
          debouncedQ,
          debouncedBirthDayFrom,
          debouncedBirthDayTo,
          page,
          limit,
        ],
      },
    }
  );

  const userList: UserView[] =
    data?.users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      prefecture: user.prefecture,
      city: user.city,
      gender: formatGender(user.gender),
      birthday: formatDateToJapanese(user.birthday),
      role: formatRole(user.role),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })) ?? [];

  const [selectedUser, setSelectedUser] = useState<UserView | null>(null);

  const handleQueryChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== "page") {
      params.set("page", "1"); // 検索条件が変わったら1ページ目へ
    }
    router.replace(`/admin/user?${params.toString()}`);
  };

  return (
    <div className="w-full h-full">
      <div className="rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gray-100 px-6 py-4">
          <h1 className="text-xl font-bold text-gray-700">ユーザー一覧</h1>
        </div>
        <div className="p-6 space-y-6">
          <UserSearchFilter
            q={q}
            onQueryChange={(val) => handleQueryChange("q", val)}
            birthDayFrom={birthDayFrom}
            birthDayTo={birthDayTo}
            onBirthDayFromChange={(val) =>
              handleQueryChange("birthDayFrom", val)
            }
            onBirthDayToChange={(val) => handleQueryChange("birthDayTo", val)}
          />

          {error != null && (
            <div className="bg-red-100 text-red-700 p-4 rounded">
              ユーザー取得に失敗しました
            </div>
          )}

          {userList.length === 0 ? (
            <div className="text-gray-700 p-4 rounded">
              ユーザーが見つかりませんでした
            </div>
          ) : (
            <UserTable
              userList={userList}
              onRowClick={(user) => setSelectedUser(user)}
            />
          )}

          <UserDetailModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
          />

          <Pagination
            page={page}
            limit={limit}
            totalCount={data?.total}
            onPageChange={(newPage) =>
              handleQueryChange("page", newPage.toString())
            }
            disableNext={false}
          />
        </div>
      </div>
    </div>
  );
}
