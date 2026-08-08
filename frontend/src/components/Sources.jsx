import { BookOpen, ExternalLink } from "lucide-react";

/**
 * Sources / References — editoryal kaynak listesi. Yalnızca gerçek kaynaklar
 * girildiğinde gösterilir. Normal editoryal linkler (spam mantığıyla otomatik
 * nofollow uygulanmaz).
 */
export default function Sources({ sources = [], title = "Kaynaklar" }) {
  const list = (sources || []).filter((s) => s?.title && s?.url);
  if (!list.length) return null;
  return (
    <section className="pb-12 bg-white" data-testid="sources">
      <div className="container-x max-w-3xl">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />
          <h2 className="font-heading text-xl font-bold text-[#07111F]">{title}</h2>
        </div>
        <ol className="mt-4 space-y-2 list-decimal list-inside">
          {list.map((s, i) => (
            <li key={i} className="text-sm text-[#334155]" data-testid={`source-${i}`}>
              <a href={s.url} target="_blank" rel="noreferrer" className="font-medium text-[#2563EB] hover:underline inline-flex items-center gap-1">
                {s.title} <ExternalLink className="h-3 w-3" />
              </a>
              {s.date && <span className="text-slate-400"> — {s.date}</span>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
