"use client";

import Search from "@/components/ui/Search";

type Props = {
  q: string;
  onQueryChange: (val: string) => void;
  birthDayFrom: string;
  birthDayTo: string;
  onBirthDayFromChange: (val: string) => void;
  onBirthDayToChange: (val: string) => void;
};

export function UserSearchFilter({
  q,
  onQueryChange,
  birthDayFrom,
  birthDayTo,
  onBirthDayFromChange,
  onBirthDayToChange,
}: Props) {
  return (
    <div className="space-y-4">
      <Search
        placeholder="ユーザー名で検索"
        value={q}
        onChange={onQueryChange}
      />
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            生年月日 From
          </label>
          <input
            type="date"
            className="border rounded px-3 py-2 w-64"
            value={birthDayFrom}
            onChange={(e) => onBirthDayFromChange(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">生年月日 To</label>
          <input
            type="date"
            className="border rounded px-3 py-2 w-64"
            value={birthDayTo}
            onChange={(e) => onBirthDayToChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
