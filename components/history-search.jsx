"use client";

import Select from "react-select";
import useHistorySearch from "@/hooks/use-history-search";

export function HistorySearch() {
  const { query, options, handleInputChange, handleOptionSelect } =
    useHistorySearch();

  // Style for suggestions dropdown.
  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: "100%",
    }),
    menu: (provided) => ({
      ...provided,
      ...{
        "& ::-webkit-scrollbar": {
          height: "100%",
          width: "5px",
          marginLeft: "5px",
        },
        "& ::-webkit-scrollbar-thumb": {
          backgroundColor: "var(--nav-color)",
        },
        "& ::-webkit-scrollbar-track, & ::-webkit-scrollbar-thumb": {
          borderRadius: "21px",
        },
        width: "100%",
      },
    }),
  };

  return (
    <div className="w-[250px]">
      <Select
        instanceId="history-search-select"
        value={query}
        onChange={handleOptionSelect}
        onInputChange={handleInputChange}
        className={"search-field text-sm"}
        isClearable={true}
        escapeClearsValue={true}
        options={options}
        classNamePrefix="react-select"
        placeholder="Search..."
        noOptionsMessage={({ inputValue }) => {
          return inputValue === ""
            ? "Start typing to search"
            : "Chat not found";
        }}
        styles={customStyles}
        maxMenuHeight={400}
      />
    </div>
  );
}
