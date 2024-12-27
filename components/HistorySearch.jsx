"use client";

/**
 * External dependencies.
 */
import Select from "react-select";

/**
 * Internal dependencies.
 */
import useHistorySearch from "@/hooks/useHistorySearch";

export const HistorySearch = () => {
  const { query, options, handleInputChange, handleOptionSelect } =
    useHistorySearch();

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
};
