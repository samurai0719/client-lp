"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Check, MapPin } from "lucide-react";
import { municipalities, prefectures, type Prefecture } from "@/data/gaikou/municipalities";

type AreaSelectorProps = {
  prefecture: Prefecture | null;
  municipality: string | null;
  onChangePrefecture: (prefecture: Prefecture) => void;
  onChangeMunicipality: (municipality: string) => void;
};

export default function AreaSelector({
  prefecture,
  municipality,
  onChangePrefecture,
  onChangeMunicipality,
}: AreaSelectorProps) {
  const [search, setSearch] = useState("");

  const filteredMunicipalities = useMemo(() => {
    if (!prefecture) return [];
    const list = municipalities[prefecture];
    if (!search.trim()) return list;
    return list.filter((city) => city.includes(search.trim()));
  }, [prefecture, search]);

  return (
    <div className="space-y-5">
      <div role="radiogroup" aria-label="都道府県" className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {prefectures.map((pref) => {
          const selected = prefecture === pref;
          return (
            <button
              key={pref}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => {
                onChangePrefecture(pref);
                setSearch("");
              }}
              className={`min-h-[56px] flex items-center justify-center gap-1.5 rounded-2xl border-2 px-2 py-3 text-[14px] sm:text-[15px] font-bold transition-colors ${
                selected ? "border-[#2f7d5a] bg-[#eaf3ee] text-[#10302a]" : "border-[#e7e3d8] bg-white text-[#3d4a45] hover:border-[#cfe3d6]"
              }`}
            >
              {selected && <Check className="w-4 h-4 text-[#2f7d5a]" aria-hidden="true" />}
              {pref}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {prefecture && (
          <motion.div
            key={prefecture}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <label htmlFor="municipality-search" className="block text-sm font-semibold text-[#10302a] mb-2">
              市区町村を選択してください
            </label>
            <div className="relative mb-3">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9bb3a8]" aria-hidden="true" />
              <input
                id="municipality-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="市区町村名で検索（任意）"
                className="w-full rounded-xl border border-[#dcd6c4] bg-white pl-10 pr-4 py-3 text-[15px] outline-none focus:border-[#2f7d5a] focus:ring-2 focus:ring-[#2f7d5a]/20"
              />
            </div>

            <div
              role="radiogroup"
              aria-label="市区町村"
              className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1"
            >
              {filteredMunicipalities.map((city) => {
                const selected = municipality === city;
                return (
                  <button
                    key={city}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => onChangeMunicipality(city)}
                    className={`min-h-[44px] flex items-center justify-center gap-1.5 rounded-xl border-2 px-2 py-2.5 text-[13px] sm:text-sm font-semibold transition-colors ${
                      selected
                        ? "border-[#2f7d5a] bg-[#eaf3ee] text-[#10302a]"
                        : "border-[#e7e3d8] bg-white text-[#3d4a45] hover:border-[#cfe3d6]"
                    }`}
                  >
                    {selected && <MapPin className="w-3.5 h-3.5 text-[#2f7d5a] shrink-0" aria-hidden="true" />}
                    {city}
                  </button>
                );
              })}
              {filteredMunicipalities.length === 0 && (
                <p className="col-span-full text-sm text-[#8a9a90] py-4 text-center">該当する市区町村が見つかりません</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
