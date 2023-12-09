"use client"
import Routes from "@/models/routes";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useRouter } from "next/navigation";
import React from "react";

export default function Search() {
  const router = useRouter();
  const [searchValue, setSearchValue] = React.useState("");
  return (
    <section className="search" id="search">
      <div className="search-field">
        <Input
          value={searchValue}
          className="search-input"
          placeholder="Search experts by typing keywords"
          onChange={(event) => setSearchValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              router.push(Routes.browseSearch(searchValue));
            }
          }}
        />
        <Button
          className="bg-none border-none px-2"
          icon={<SearchOutlined className="search-icon" />}
          onClick={() => {
            router.push(Routes.browseSearch(searchValue));
          }}
        />
      </div>
    </section>
  );
}
