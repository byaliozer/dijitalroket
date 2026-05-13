"""
One-time seed: replace demo case studies with real Dijital Roket projects
scraped from https://www.dijitalroket.com/roketlediklerimiz
Run: python3 /app/backend/seed_real_projects.py
"""
import asyncio
import os
import uuid
from datetime import datetime, timezone
from dotenv import load_dotenv
from pathlib import Path
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv(Path(__file__).parent / ".env")

PROJECTS = [
    {
        "slug": "namtas-bursa-dijital-donusum",
        "title": "Bursa Taş Parke NAMTAŞ — ROKETLENDİ",
        "client": "NAMTAŞ BURSA",
        "sector": "Üretim / İnşaat",
        "tags": ["Kurumsal Web", "SEO", "Logo", "3D Animasyon", "Google Haritalar"],
        "cover_image": "/projects/namtas.webp",
        "need": "NAMTAŞ BURSA'nın hiç web sitesi yoktu, Instagram kişisel kullanılıyordu, profesyonel logosu bulunmuyordu ve müşterilere ürünleri telefon galerisinden gösteriyordu. Hedef; 'Bursa Taş Parke' aramasında Google'da ön sıralara çıkmak ve uçtan uca dijital bir sistemle kurumsal marka inşa etmekti.",
        "solution": "Dijital Roket'e ait özel altyapı üzerinde sıfırdan web sitesi geliştirildi (namtasbursa.com). Teknik SEO + site içi SEO + içerik üretimi yapıldı; hız ve mobil uyumluluk optimize edildi. Profesyonel galeri/ürün sunum sistemi kuruldu, yeni logo ve 4 adet 3D animasyonlu kurumsal video üretildi, kartvizit tasarımı yapıldı, Instagram-Facebook-YouTube hesapları açıldı (drone çekimi 4 video), Google Business profili optimize edildi.",
        "result": "Marka, dijitalde kurumsal, prestijli ve güven veren bir yapıya kavuştu. 'Bursa Taş Parke' aramasında Google ilk sayfa konumu elde edildi. Sektör ortalamasının çok üzerinde hız performansı (Google'dan rekor puan), profesyonel galeri sistemiyle saha satışında dahi 'web sitesi açılıp kurumsal sunum yapılabiliyor'. Müşteri yorumu: 'Biz sadece web sitesi istemiştik, onlar bize kurumsal bir marka inşa ettiler.'",
    },
    {
        "slug": "metehan-garaj-dijital-donusum",
        "title": "Metehan Garaj — ROKETLENDİ",
        "client": "Metehan Garaj",
        "sector": "Otomotiv",
        "tags": ["Kurumsal Web", "SEO", "Logo", "3D Animasyon"],
        "cover_image": "/projects/metehan-garaj.webp",
        "need": "İstanbul İSTOÇ İş Merkezi'nde faaliyet gösteren oto galerinin, dijital dünyada profesyonel görünmeye ve markalaşmaya ihtiyacı vardı. İyi hizmet vermek artık tek başına yeterli değildi.",
        "solution": "Markaya özel modern, hızlı ve mobil uyumlu profesyonel web sitesi tasarlandı (metehangaraj.com). Sektöre uygun modern logo ve kurumsal kimlik üretildi; logo 3D animasyonlu hale getirilerek tanıtım videolarında kullanılmak üzere hazırlandı. Anahtar kelime analizi + sayfa içi SEO + teknik SEO altyapısı kuruldu.",
        "result": "Metehan Garaj dijitalde daha kurumsal, müşteri gözünde daha güvenilir ve Google'da daha görünür bir marka haline geldi. Tanıtım ve açılış videolarında kullanılabilen prestijli görsel kimlik ekosistemi oluştu.",
    },
    {
        "slug": "abc-ilkyardim-seo-sosyal-medya",
        "title": "ABC İlk Yardım Eğitim Merkezi — ROKETLENDİ",
        "client": "ABC İlk Yardım Eğitim Merkezi",
        "sector": "Eğitim / Sağlık",
        "tags": ["SEO", "Sosyal Medya", "İçerik", "Blog Sistemi"],
        "cover_image": "/projects/abc-ilkyardim.webp",
        "need": "'Bursa İlkyardım Eğitimi' ve 'Bursa İlkyardım Eğitim Merkezi' aramalarında üst sıralara çıkmak, kurumsal firmaların İK departmanlarından eğitim başvuruları almak ve sosyal medyada güven veren bir marka algısı oluşturmak.",
        "solution": "Google Search Console + Analytics + Site Kit kurulumu, anahtar kelime analizi, rakip analizi ve teknik SEO altyapısı kuruldu. Site içi SEO optimizasyonu (başlık, açıklama, hizmet sayfaları, mobil uyumluluk, site hızı, iç link), blog sistemi kurulumu ve SEO uyumlu yazılar (örn. 'İşyerinde kaç ilk yardımcı bulundurmak zorunlu?'), paralelde Instagram için kapsamlı içerik planı.",
        "result": "Web sitesinin SEO skoru 60'tan 100'e çıkarıldı — ilk yardım sektöründe REKOR. Google görünürlüğü, ziyaretçi sayısı, kurumsal eğitim başvuruları ve Instagram etkileşimlerinde artış hedeflendi; dijital varlık profesyonelleşti.",
    },
    {
        "slug": "arsiyad-sosyal-medya-yonetimi",
        "title": "ARSİYAD Sosyal Medya Yönetimi",
        "client": "ARSİYAD (Artvinli Sanayici ve İş İnsanları Derneği)",
        "sector": "Dernek / STK",
        "tags": ["Sosyal Medya", "İçerik Üretimi", "Kurumsal İletişim"],
        "cover_image": "/projects/arsiyad.webp",
        "need": "Bursa ve çevresinin köklü iş insanları derneği ARSİYAD; kurumsal değerlerini dijitalde prestijli göstermek, üye paylaşımlarını profesyonelce sunmak, etkinlik ve iletişimlerini etkili şekilde duyurmak için stratejik bir iletişim partnerine ihtiyaç duyuyordu.",
        "solution": "Dijital Roket olarak üye tanıtım görselleri, etkinlik duyuruları, röportajlar ve kurumsal mesajların tamamı kurumsal kimliğe ve sektör diline uygun şekilde özgün olarak tasarlandı. Stratejik içerik planlama, paylaşım takvimi ve raporlama dahil uçtan uca sosyal medya yönetimi yürütülüyor.",
        "result": "ARSİYAD'ın dijital iletişim dili güçlendi; üye paylaşımları, etkinlikler ve kurumsal duyurular tutarlı, prestijli bir sosyal medya hattıyla yayınlanıyor. Kurumsal itibar dijital anlatımla taçlandı.",
    },
    {
        "slug": "dr-ai-yayinda-sosyal-medya-devrimi",
        "title": "DR AI Yayında! İşletmeler İçin Sosyal Medyada Devrim",
        "client": "Dijital Roket (Kendi Ürünümüz)",
        "sector": "AI / Sosyal Medya",
        "tags": ["DR AI", "Sosyal Medya", "Yapay Zeka", "Pazarlama"],
        "cover_image": "/projects/dr-ai-yayinda.webp",
        "need": "Küçük ve orta ölçekli işletmelerin, esnafların, girişimcilerin ve kurumsal firmaların sosyal medya içerik üretiminde yaşadığı 'zaman + maliyet + tasarımcı bağımlılığı' sorununa kalıcı bir çözüm üretmek.",
        "solution": "DR AI; yapay zeka desteğiyle markaya özel sosyal medya içeriklerini (görsel + metin + kampanya) üreten akıllı dijital pazarlama uygulaması olarak geliştirildi. İşletme markasını analiz eden, sektör dilini öğrenen ve şablon değil özgün üretim yapan bir altyapı kuruldu.",
        "result": "Dijital Roket'in kendi AI ürün ekosistemi devreye girdi. Klasik ajans modelinde haftalarca süren içerik üretimi süreçleri saatlere ve dakikalara indi; kullanıcılar kendi sosyal medyalarını yapay zeka ile profesyonelce yönetebilir hale geldi.",
    },
    {
        "slug": "dr-ai-2026-sosyal-medya-kurallari",
        "title": "Sosyal Medyanın Kuralları Yeniden Yazılıyor — DR AI 2026",
        "client": "Dijital Roket (Kendi Ürünümüz)",
        "sector": "AI / İçerik Üretimi",
        "tags": ["DR AI 2026", "AI", "Sosyal Medya", "İçerik"],
        "cover_image": "/projects/dr-ai-2026.webp",
        "need": "Sosyal medya; 'olanın paylaştığı bir alan' olmaktan çıkıp büyümek isteyen her işletme için zorunlu oyun alanı haline geldi. Klasik ajans modeli (haftalık planlar, günlerce beklenen tasarımlar, yüksek bütçeler) artık hız ihtiyacına yetişemiyor.",
        "solution": "DR AI 2026 sürümü; markaya özel üretim hattı, akıllı kampanya görseli üretimi, dinamik içerik planlama ve marka dili öğrenen prompt mimarisiyle yeniden kurgulandı. İçerik üretim hattı, klasik ajans hızı yerine 'işletme talep edince anında' modeliyle çalışacak şekilde tasarlandı.",
        "result": "Sosyal medya yönetiminde yeni bir standart oluştu: işletmeler ajansa bağımlı olmadan, marka kimliğini koruyarak, ölçeklenebilir hızda içerik üretebiliyor. DR AI 2026, Dijital Roket'in pazarlama hızı stratejisinin temel motoru oldu.",
    },
]


async def main():
    client = AsyncIOMotorClient(os.environ["MONGO_URL"])
    db = client[os.environ["DB_NAME"]]
    # wipe existing case studies and insert the real ones
    deleted = await db.case_studies.delete_many({})
    print(f"Deleted {deleted.deleted_count} existing case studies")
    docs = []
    for p in PROJECTS:
        docs.append({
            "id": str(uuid.uuid4()),
            **p,
            "published": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
    result = await db.case_studies.insert_many(docs)
    print(f"Inserted {len(result.inserted_ids)} real projects")
    # Mark seed flag so the in-app seeder doesn't re-add the demo ones
    await db.config.update_one({"_id": "seed"}, {"$set": {"real_projects_seeded": True}}, upsert=True)
    client.close()


if __name__ == "__main__":
    asyncio.run(main())
