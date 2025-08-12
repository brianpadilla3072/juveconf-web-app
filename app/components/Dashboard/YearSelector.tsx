"use client"
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Calendar } from 'lucide-react';

interface YearSelectorProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
  years?: number[];
}

export const YearSelector: React.FC<YearSelectorProps> = ({
  selectedYear,
  onYearChange,
  years
}) => {
  const currentYear = new Date().getFullYear();
  const yearOptions = years || Array.from({ length: 5 }, (_, i) => currentYear - i);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
      >
        <Calendar className="h-4 w-4" />
        <span>{selectedYear}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[120px]">
          <div className="py-1">
            {yearOptions.map((year) => (
              <button
                key={year}
                onClick={() => {
                  onYearChange(year);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  selectedYear === year 
                    ? 'bg-red-50 text-red-600 font-medium' 
                    : 'text-gray-700'
                }`}
              >
                {year}
                {year === currentYear && (
                  <span className="ml-2 text-xs text-gray-400">(actual)</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};