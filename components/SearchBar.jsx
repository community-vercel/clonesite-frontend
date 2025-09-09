'use client';
import { useState, useEffect } from 'react';
import { useCombobox } from 'downshift';
import api from '../lib/api';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (search.length > 2) {
        const res = await api.get(`/services/search?query=${search}`);
        setSuggestions(res.data.data.items);
      } else {
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [search]);

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getItemProps,
    highlightedIndex,
  } = useCombobox({
    items: suggestions,
    onInputValueChange: ({ inputValue }) => setSearch(inputValue),
    itemToString: (item) => (item ? item.title : ''),
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        router.push(`/services/${selectedItem._id}`);
      }
    },
  });

  return (
    <div className="relative max-w-xl mx-auto">
      <input
        {...getInputProps()}
        placeholder="What service do you need? e.g. Plumber"
        className="w-full p-3 rounded-l-lg text-gray-800 border focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <button
        onClick={() => router.push(`/services?query=${search}`)}
        className="bg-primary text-white py-3 px-6 rounded-r-lg hover:bg-green-600"
      >
        Find Pros
      </button>
      <ul
        {...getMenuProps()}
        className={`absolute z-10 w-full bg-white border rounded-lg mt-1 max-h-60 overflow-auto ${isOpen && suggestions.length ? 'block' : 'hidden'}`}
      >
        {suggestions.map((item, index) => (
          <li
            key={item._id}
            {...getItemProps({ item, index })}
            className={`p-2 cursor-pointer ${highlightedIndex === index ? 'bg-primary text-white' : 'text-gray-800'}`}
          >
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  );
}