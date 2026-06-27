import Image from "next/image";

export default function GaikouHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-[#e7e3d8] shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center gap-3">
        <Image
          src="/images/gaikou/logo-transparent.png"
          alt="高長建設"
          width={40}
          height={40}
          className="w-9 h-9 sm:w-10 sm:h-10 object-contain"
          priority
        />
        <span className="text-base sm:text-lg font-bold text-[#10302a] tracking-wide">
          高長建設
        </span>
      </div>
    </header>
  );
}
