"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, MapPin } from "lucide-react";
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
              onClick={() => onChangePrefecture(pref)}
              className={`min-h-[48px] flex items-center justify-center gap-1.5 rounded-xl border-2 px-2 py-2 text-[13px] sm:text-[14px] font-bold transition-colors ${
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
            <label htmlFor="municipality-input" className="block text-sm font-semibold text-[#10302a] mb-2">
              市区町村を入力してください
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9bb3a8]" aria-hidden="true" />
              <input
                id="municipality-input"
                type="text"
                list="municipality-suggestions"
                value={municipality ?? ""}
                onChange={(e) => onChangeMunicipality(e.target.value)}
                placeholder="例：岐阜市"
                autoComplete="off"
                className="w-full rounded-xl border border-[#dcd6c4] bg-white pl-10 pr-4 py-3 text-[15px] outline-none focus:border-[#2f7d5a] focus:ring-2 focus:ring-[#2f7d5a]/20"
              />
              <datalist id="municipality-suggestions">
                {municipalities[prefecture].map((city) => (
                  <option key={city} value={city} />
                ))}
              </datalist>
            </div>
            <p className="mt-2 text-xs text-[#8a9a90]">一覧から選ばず、直接入力していただくこともできます</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
