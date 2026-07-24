import React, { useState, useRef } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({
  placeholder = 'Search courses, lessons...',
  value: externalValue,
  onChange,
  onSearch,
  size = '',    // '' | sm | lg
  className = '',
}) => {
  const [internalValue, setInternalValue] = useState('');
  const inputRef = useRef(null);

  const isControlled = externalValue !== undefined;
  const value = isControlled ? externalValue : internalValue;

  const handleChange = (e) => {
    if (!isControlled) setInternalValue(e.target.value);
    onChange?.(e.target.value);
  };

  const handleClear = () => {
    if (!isControlled) setInternalValue('');
    onChange?.('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSearch?.(value);
  };

  return (
    <div className={`searchbar${size ? ` searchbar--${size}` : ''} ${className}`}>
      <span className="searchbar-icon"><Search size={16} /></span>
      <input
        ref={inputRef}
        type="search"
        className="searchbar-input"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        aria-label="Search"
      />
      {value && (
        <button className="searchbar-clear" onClick={handleClear} aria-label="Clear search">
          <X size={12} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
