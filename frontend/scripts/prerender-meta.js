/* Postbuild prerender of per-route <title>/<meta description>/<canonical> into
   static HTML so search engines get unique metadata from the INITIAL HTML
   (CRA/CSR limitation workaround). #root stays empty -> React mounts normally,
   no hydration change. Best-effort: never fails the build. */
const fs = require("fs");
const path = require("path");

const BUILD = path.join(__dirname, "..", "build");
const SITE = "https://www.dijitalroket.com";

const ROUTES = {
  "": {
    title: "Dijital Roket | Özel Yazılım, B2B, CRM & AI Çözümleri",
    desc: "Dijital Roket; kurumsal web, B2B bayi sistemleri, özel CRM yazılımları, AI Agent çözümleri ve dijital dönüşüm projeleri geliştiren Bursa merkezli teknoloji şirketidir.",
  },
  hizmetler: {
    title: "Dijital Roket Hizmetleri | Yazılım, B2B, CRM & AI",
    desc: "Kurumsal web tasarımından B2B bayi sistemlerine, özel CRM ve yazılımdan AI Agent çözümlerine kadar Dijital Roket'in kurumsal teknoloji hizmetlerini keşfedin.",
  },
  projeler: {
    title: "Dijital Roket Projeleri | Web, Yazılım, B2B & AI",
    desc: "Dijital Roket tarafından geliştirilen kurumsal web sitelerini, B2B sistemlerini, özel yazılım projelerini, yönetim panellerini ve dijital dönüşüm çalışmalarını inceleyin.",
  },
  hakkimizda: {
    title: "Dijital Roket Hakkında | Teknoloji & Dijital Dönüşüm",
    desc: "Dijital Roket'in özel yazılım, yapay zekâ, kurumsal web ve dijital dönüşüm alanlarındaki yaklaşımını, teknoloji vizyonunu ve geliştirdiği çözümleri yakından tanıyın.",
  },
  iletisim: {
    title: "Dijital Roket İletişim | Projenizi Birlikte Planlayalım",
    desc: "Web sitesi, B2B, CRM, özel yazılım veya yapay zekâ projeniz için Dijital Roket ile iletişime geçin. Bursa merkezli ekibimiz Türkiye genelinde hizmet vermektedir.",
  },
  blog: {
    title: "Dijital Roket Blogu | Dijital Dönüşüm İçgörüleri",
    desc: "Kurumsal web, B2B, CRM, yapay zekâ ve özel yazılım üzerine Dijital Roket içgörüleri, rehberler ve gerçek proje deneyimleri.",
  },
  "hizmetler/kurumsal-web-tasarim": {
    title: "Kurumsal Web Tasarım | Dijital Roket",
    desc: "Kurumsal, premium ve dönüşüm odaklı web siteleri. Dijital Roket ile markanıza özel, SEO uyumlu kurumsal web tasarımı.",
  },
  "hizmetler/b2b-bayi-sistemi": {
    title: "B2B Bayi Sistemi | Dijital Roket",
    desc: "Bayi girişi, özel fiyat, stok, sipariş, cari ve ERP entegrasyonlu firmaya özel B2B bayi yönetim sistemi geliştiriyoruz.",
  },
  "hizmetler/ozel-crm-yazilimi": {
    title: "Özel CRM Yazılımı | Dijital Roket",
    desc: "Müşteri, teklif, satış pipeline ve otomasyon içeren firmaya özel CRM yazılımı. Hazır CRM'lerin ötesinde, sürecinize göre.",
  },
  "dr-ai": {
    title: "DR AI Nedir? | Dijital Roket",
    desc: "DR AI, Dijital Roket'in proje geliştirme ve içerik üretim süreçlerinde kullandığı yapay zekâ destekli üretim sistemidir.",
  },
  "dr-ai-ile-uret": {
    title: "DR AI ile Üret | Fikrinizi Yapay Zeka ile Projeye Dönüştürün — Dijital Roket",
    desc: "Aklınızdaki yazılım fikrini yazın; Dijital Roket'in yapay zekâsı DR AI birkaç akıllı soruyla kapsamı netleştirsin, canlı bir proje taslağı ve örnek arayüz görseli oluştursun.",
  },
  "bursa-web-tasarim": {
    title: "Bursa Web Tasarım & Dijital Dönüşüm | Dijital Roket",
    desc: "Osmangazi/Bursa merkezli web tasarım, özel yazılım ve dijital dönüşüm ajansı. Kurumsal web, B2B, CRM ve DR AI destekli çözümler. Bursa + Türkiye geneli hizmet.",
  },
};

function applyMeta(html, title, desc, canonical) {
  let out = html;
  out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
  out = out.replace(
    /<meta\s+name="description"[^>]*>/i,
    `<meta name="description" content="${desc}" />`
  );
  out = out.replace(/<meta\s+property="og:title"[^>]*>/i, `<meta property="og:title" content="${title}" />`);
  out = out.replace(/<meta\s+property="og:description"[^>]*>/i, `<meta property="og:description" content="${desc}" />`);
  out = out.replace(/<meta\s+name="twitter:title"[^>]*>/i, `<meta name="twitter:title" content="${title}" />`);
  out = out.replace(/<meta\s+name="twitter:description"[^>]*>/i, `<meta name="twitter:description" content="${desc}" />`);
  if (/<link\s+rel="canonical"[^>]*>/i.test(out)) {
    out = out.replace(/<link\s+rel="canonical"[^>]*>/i, `<link rel="canonical" href="${canonical}" />`);
  } else {
    out = out.replace("</head>", `    <link rel="canonical" href="${canonical}" />\n  </head>`);
  }
  return out;
}

try {
  const indexPath = path.join(BUILD, "index.html");
  if (!fs.existsSync(indexPath)) {
    console.warn("[prerender-meta] build/index.html not found, skipping.");
    process.exit(0);
  }
  const base = fs.readFileSync(indexPath, "utf8");
  let count = 0;
  for (const [route, meta] of Object.entries(ROUTES)) {
    const canonical = route === "" ? `${SITE}/` : `${SITE}/${route}`;
    const html = applyMeta(base, meta.title, meta.desc, canonical);
    if (route === "") {
      fs.writeFileSync(indexPath, html, "utf8");
    } else {
      const dir = path.join(BUILD, route);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, "index.html"), html, "utf8");
    }
    count++;
  }
  console.log(`[prerender-meta] wrote unique metadata for ${count} routes.`);
} catch (e) {
  console.warn("[prerender-meta] non-fatal error:", e && e.message);
  process.exit(0);
}
