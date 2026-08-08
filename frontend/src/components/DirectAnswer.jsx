import { Sparkles } from "lucide-react";

/**
 * DirectAnswer — AEO/AI-search için soru başlığının hemen altında kısa, kendi
 * başına anlaşılır (40-100 kelime) doğrudan cevap sunar. Sayfada gerçek,
 * kullanıcıya görünür bir metindir (gizli/spam değil).
 */
export default function DirectAnswer({ children, testid }) {
  if (!children) return null;
  return (
    <div
      className="not-prose my-5 flex gap-3 rounded-2xl border border-[#2563EB]/20 bg-[#2563EB]/5 p-5"
      data-testid={testid || "direct-answer"}
    >
      <Sparkles className="h-5 w-5 shrink-0 text-[#2563EB]" aria-hidden="true" />
      <p className="text-[15px] leading-relaxed text-[#0B2447] font-medium">{children}</p>
    </div>
  );
}
