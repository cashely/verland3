import { useState } from "react";
import SearchForm from "@/components/SearchForm";
import { searchConfig } from './config'


export default function appointManagement() {

  return (
    <SearchForm formList={searchConfig} />
  );
}
