import React from "react";
import {
  Menu,
  Mic,
  Search,
  X,
  Coffee,
  Fuel,
  ShoppingCart,
  Utensils,
} from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { fuzzySearch } from "../utils/dpSearch";

const COMMON_PLACES = [
  "Jakarta",
  "Bandung",
  "Surabaya",
  "Yogyakarta",
  "Bali",
  "Semarang",
  "Restoran",
  "SPBU",
  "Rumah Sakit",
  "Apotek",
  "Hotel",
  "Mall",
  "Supermarket",
  "Coffee Shop",
  "Bank",
  "ATM",
  "Taman",
];

export default function FloatingSearchBar({
  userInput,
  setUserInput,
  handleSearch,
  loading,
  isDark,
  clearRoute,
}) {
  const [suggestions, setSuggestions] = React.useState([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  const quickCategories = [
    { icon: <Utensils size={14} />, label: "Restoran" },
    { icon: <Fuel size={14} />, label: "SPBU" },
    { icon: <Coffee size={14} />, label: "Coffee Shop" },
    { icon: <ShoppingCart size={14} />, label: "Supermarket" },
  ];

  const handleInputChange = (e) => {
    const value = e.target.value;
    setUserInput(value);

    if (value.trim().length > 0) {
      const results = fuzzySearch(value, COMMON_PLACES, 2);
      setSuggestions(results);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setUserInput(suggestion);
    setShowSuggestions(false);
    handleSearch(suggestion);
  };

  return (
    <div className="absolute top-4 md:top-6 left-0 right-0 z-[5000] px-4 md:px-6 pointer-events-none flex flex-col items-center">
      {/* Search Bar Container */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
        className={`w-full max-w-md md:max-w-lg lg:max-w-2xl flex items-center p-2 rounded-2xl md:rounded-full pointer-events-auto transition-all duration-500 ease-in-out ${
          isDark ? "glass-dark text-[#e8eaed]" : "glass text-[#202124]"
        }`}
      >
        <button className="p-2 ml-1 opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-all">
          <Menu size={22} />
        </button>

        <input
          className="flex-1 bg-transparent px-3 md:px-4 outline-none text-base md:text-lg font-normal placeholder:text-gray-500/70 min-w-0"
          placeholder="Cari tempat atau kriteria..."
          value={userInput}
          onChange={handleInputChange}
          onFocus={() => {
            if (userInput.trim() && suggestions.length > 0)
              setShowSuggestions(true);
          }}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setShowSuggestions(false);
              handleSearch();
            }
          }}
        />

        <AnimatePresence>
          {userInput && (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={clearRoute}
              className="p-2 opacity-60 hover:opacity-100 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-all text-gray-500"
            >
              <X size={20} />
            </motion.button>
          )}
        </AnimatePresence>

        <div className="w-[1px] h-6 bg-gray-400/20 mx-1" />

        <button className="p-2.5 opacity-60 hover:opacity-100 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-all group">
          <Mic
            size={22}
            className={`transition-colors ${loading ? "animate-pulse text-red-500" : "group-hover:text-blue-500"}`}
          />
        </button>

        <button
          onClick={() => handleSearch()}
          disabled={loading}
          className={`p-2.5 md:p-3 mr-1 ml-1 rounded-full text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95 transition-all ${loading ? "opacity-50" : ""}`}
        >
          {loading ? (
            <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
          ) : (
            <Search size={22} />
          )}
        </button>
      </motion.div>

      {/* Auto-suggest Dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`w-full max-w-md md:max-w-lg lg:max-w-2xl mt-2 rounded-2xl overflow-hidden pointer-events-auto shadow-2xl ${
              isDark
                ? "glass-dark border border-white/10"
                : "glass border border-black/5"
            }`}
          >
            <ul className="py-2">
              {suggestions.map((suggestion, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleSelectSuggestion(suggestion)}
                    className={`w-full text-left px-5 py-3 flex items-center gap-3 transition-colors ${
                      isDark
                        ? "text-gray-200 hover:bg-white/10"
                        : "text-gray-700 hover:bg-black/5"
                    }`}
                  >
                    <Search size={16} className="opacity-50" />
                    <span className="font-medium">{suggestion}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Category Chips */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
        className="w-full max-w-md md:max-w-lg lg:max-w-2xl mt-4 flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide pointer-events-auto px-1"
      >
        {quickCategories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => {
              setUserInput(cat.label);
              handleSearch(cat.label);
            }}
            className={`flex-shrink-0 flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-full text-sm font-medium transition-all border group active:scale-95 ${
              isDark
                ? "glass-dark border-white/5 text-[#e8eaed] hover:bg-white/5"
                : "glass border-black/5 text-gray-700 hover:bg-black/5"
            }`}
          >
            <span
              className={`transition-transform group-hover:scale-110 ${isDark ? "text-blue-400" : "text-blue-600"}`}
            >
              {cat.icon}
            </span>
            {cat.label}
          </button>
        ))}
      </motion.div>
    </div>
  );
}
