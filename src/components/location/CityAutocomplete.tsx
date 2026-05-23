"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { TR_CITIES, type TrCity } from "@/lib/constants/tr-cities";

interface CityAutocompleteProps {
  name: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

const MAX_RESULTS = 8;

function filterCities(query: string): TrCity[] {
  const q = query.trim().toLocaleLowerCase("tr");
  if (!q) return [];
  return TR_CITIES.filter((c) =>
    c.name.toLocaleLowerCase("tr").startsWith(q),
  ).slice(0, MAX_RESULTS);
}

export function CityAutocomplete({
  name,
  defaultValue = "",
  required,
  placeholder,
  className,
}: CityAutocompleteProps) {
  const [value, setValue] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const results = isOpen ? filterCities(value) : [];

  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const select = useCallback((city: TrCity) => {
    setValue(city.name);
    setIsOpen(false);
    setHighlighted(-1);
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setValue(next);
    if (next.trim().length >= 1) {
      setIsOpen(true);
      setHighlighted(-1);
    } else {
      setIsOpen(false);
    }
  };

  const onFocus = () => {
    if (value.trim().length >= 1) setIsOpen(true);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setHighlighted(-1);
      return;
    }
    if (!isOpen || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      if (highlighted >= 0) {
        e.preventDefault();
        select(results[highlighted]);
      }
    } else if (e.key === "Tab") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        required={required}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-expanded={isOpen}
        aria-autocomplete="list"
        aria-controls={listboxId}
        className={className}
      />
      {isOpen && results.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-20 mt-1 max-h-60 overflow-auto rounded-xl border border-navy-900/10 bg-card shadow-card-hover"
        >
          {results.map((city, i) => (
            <li
              key={city.slug}
              role="option"
              aria-selected={highlighted === i}
              onPointerDown={(e) => {
                e.preventDefault();
                select(city);
              }}
              onMouseEnter={() => setHighlighted(i)}
              className={`cursor-pointer px-3 py-2 text-sm transition-smooth ${
                highlighted === i
                  ? "bg-cream-100 text-accent"
                  : "text-navy-800 hover:bg-cream-50"
              }`}
            >
              {city.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
