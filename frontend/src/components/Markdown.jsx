import { useState } from "react";

/**
 * Shared markdown renderer for blog & project content.
 * Supports: ## H2, ### H3, **bold**, > quote, - bullets,
 *           ![alt](url) images, ![alt](url){w=75} sized images (% width),
 *           and raw HTML blocks (lines starting with "<").
 */
function inline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i} className="font-semibold text-[#07111F]">{p.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}

export default function Markdown({ source = "" }) {
  const [lightbox, setLightbox] = useState(null);
  if (!source) return null;
  const lines = source.split(/\r?\n/);
  const out = [];
  let paraBuf = [];
  let listBuf = [];
  let htmlBuf = [];

  const flushPara = () => {
    if (paraBuf.length) {
      const text = paraBuf.join(" ").trim();
      if (text) {
        out.push(
          <p key={`p-${out.length}`} className="mt-4 text-[16px] sm:text-[17px] leading-[1.85] text-[#334155]">
            {inline(text)}
          </p>
        );
      }
      paraBuf = [];
    }
  };
  const flushList = () => {
    if (listBuf.length) {
      out.push(
        <ul key={`ul-${out.length}`} className="mt-3 mb-3 space-y-2 list-disc pl-6 text-[#334155]">
          {listBuf.map((l, i) => (
            <li key={i} className="leading-relaxed text-[16px]">{inline(l)}</li>
          ))}
        </ul>
      );
      listBuf = [];
    }
  };
  const flushHtml = () => {
    if (htmlBuf.length) {
      out.push(
        <div
          key={`html-${out.length}`}
          className="dr-html my-6"
          dangerouslySetInnerHTML={{ __html: htmlBuf.join("\n") }}
        />
      );
      htmlBuf = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trim();

    // Continue collecting a raw HTML block until a blank line.
    if (htmlBuf.length) {
      if (!line) { flushHtml(); continue; }
      htmlBuf.push(raw);
      continue;
    }

    if (!line) { flushPara(); flushList(); continue; }

    // Image: ![alt](url) with optional {w=NN} percentage width
    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)\s]+)\)(?:\{w=(\d+)\})?$/);
    if (imgMatch) {
      flushPara(); flushList();
      const alt = imgMatch[1];
      const url = imgMatch[2];
      const w = imgMatch[3] ? Math.min(100, parseInt(imgMatch[3], 10)) : 100;
      out.push(
        <figure key={`img-${out.length}`} className="my-8 flex flex-col items-center">
          <button
            type="button"
            onClick={() => setLightbox({ url, alt })}
            style={{ width: `${w}%`, maxWidth: "100%" }}
            className="block overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
          >
            <img src={url} alt={alt} loading="lazy" className="w-full h-auto object-cover transition-transform duration-500 hover:scale-[1.02]" />
          </button>
          {alt && <figcaption className="mt-3 text-center text-sm text-[#334155]/70">{alt}</figcaption>}
        </figure>
      );
      continue;
    }

    // Raw HTML block (starts with a tag)
    if (line.startsWith("<")) {
      flushPara(); flushList();
      htmlBuf.push(raw);
      continue;
    }

    if (line.startsWith("## ")) {
      flushPara(); flushList();
      out.push(
        <h2 key={`h2-${out.length}`} className="mt-12 mb-3 font-heading text-2xl sm:text-3xl font-bold text-[#07111F]">
          {line.slice(3).trim()}
        </h2>
      );
      continue;
    }
    if (line.startsWith("### ")) {
      flushPara(); flushList();
      out.push(
        <h3 key={`h3-${out.length}`} className="mt-8 mb-2 font-heading text-lg sm:text-xl font-semibold text-[#07111F]">
          {line.slice(4).trim()}
        </h3>
      );
      continue;
    }
    if (line.startsWith("> ")) {
      flushPara(); flushList();
      out.push(
        <blockquote key={`q-${out.length}`} className="my-6 border-l-4 border-[#2563EB] bg-[#F8FAFC] px-6 py-4 rounded-r-xl">
          <p className="text-[#07111F] italic leading-relaxed">{inline(line.slice(2))}</p>
        </blockquote>
      );
      continue;
    }
    if (line.startsWith("- ")) {
      flushPara();
      listBuf.push(line.slice(2));
      continue;
    }
    flushList();
    paraBuf.push(line);
  }
  flushPara(); flushList(); flushHtml();

  return (
    <>
      {out}
      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" onClick={() => setLightbox(null)}>
          <img src={lightbox.url} alt={lightbox.alt} className="max-w-5xl max-h-[85vh] object-contain rounded-xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}
