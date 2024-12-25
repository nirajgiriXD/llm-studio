"use client";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import useHistorySearch from "@/hooks/use-history-search";

export function HistorySearch() {
  const {
    query,
    options,
    inputRef,
    containerRef,
    isDropdownVisible,
    handleInputChange,
    handleOptionSelect,
  } = useHistorySearch();

  return (
    <div ref={containerRef} className="relative">
      <Command className="rounded-md border h-auto md:min-w-[300px]">
        <CommandInput
          ref={inputRef}
          placeholder="Search..."
          value={query}
          onInput={handleInputChange}
        />
        <div
          className="absolute top-full left-0 mt-1 z-50 bg-white border rounded-md w-full max-h-40"
          style={{
            display: isDropdownVisible ? "block" : "none",
          }}
        >
          <CommandList className="max-h-40 overflow-y-auto">
            <CommandEmpty className="text-sm text-center h-auto my-2">
              No results found
            </CommandEmpty>

            {/* Options */}
            {options.map((option, idx) => {
              {/* console.log(option); */}
              return <CommandItem
                key={idx}
                onSelect={handleOptionSelect}
                className="cursor-pointer"
                value={option.value}
              >
                {option.title}
              </CommandItem>
            })}
          </CommandList>
        </div>
      </Command>
    </div>
  );
}
