"use client";

import { Table, Column } from "@/components/ui/Table";
import { UserView } from "../types/view";

type Props = {
  userList: UserView[];
  onRowClick: (user: UserView) => void;
};

export function UserTable({ userList, onRowClick }: Props) {
  const columns: Column<UserView>[] = [
    {
      key: "name",
      label: "名前",
    },
    { key: "email", label: "メール" },
    {
      key: "prefecture",
      label: "住所",
      render: (_, row) => row.prefecture + row.city,
    },
    {
      key: "gender",
      label: "性別",
      render: (value) => (
        <span
          className={`inline-block px-2 py-1 rounded text-sm font-medium ${
            value === "男性"
              ? "bg-blue-100 text-blue-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {value}
        </span>
      ),
    },
    { key: "birthday", label: "誕生日" },
    {
      key: "role",
      label: "権限",
      render: (value) => (
        <span
          className={`inline-block px-2 py-1 rounded text-sm font-medium ${
            value === "一般"
              ? "bg-blue-100 text-blue-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  return (
    <Table
      data={userList}
      columns={columns}
      keyField="id"
      onRowClick={onRowClick}
    />
  );
}
