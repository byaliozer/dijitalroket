"""
Full seed: all 6 Dijital Roket projects with rich content (paragraphs + headings + bullets)
and image galleries scraped from https://www.dijitalroket.com/roketlediklerimiz detail pages.

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


NAMTAS_CONTENT = """Dijital Roket olarak bu ay Bursa'nın köklü firmalarından **NAMTAŞ BURSA** için kapsamlı bir dijital dönüşüm projesini hayata geçirdik. Hedefimiz; markayı dijital dünyada **kurumsal, prestijli ve güven veren** bir yapıya taşımak ve "Bursa Taş Parke" aramalarında güçlü bir konum elde etmek; bunu da yalnızca bir web sitesiyle değil, uçtan uca bir dijital sistemle sağlamak oldu.

## Proje Başlangıcında Durum
NAMTAŞ BURSA'nın daha önce:
- Hiçbir web sitesi yoktu
- Instagram hesabı kişisel ve amatör şekilde kullanılıyordu
- Profesyonel bir logosu bulunmuyordu
- Müşterilere ürünleri göstermek için kendi telefon galerisini açıp fotoğraf arıyordu
- Dijital dünyada **hiç görünürlüğü yoktu**
- İşlerin tamamı eş-dost çevresiyle yürüyordu

Ama hedefleri çok netti: "Bursa Taş Parke" aramasında Google'da ön sıralara çıkmak, tüm ürün ve uygulama örneklerini profesyonel şekilde sunabilmek, müşterilerin karşısına güçlü bir kurumsal marka olarak çıkmak ve işi sadece Bursa değil, **tüm Türkiye'ye açmak**.

## Dijital Roket Dokunuşları

### 1. Özel Yazılım & İçerik Üretimi
Web sitesi, Dijital Roket'e ait **özel bir altyapı** üzerinde sıfırdan geliştirildi. Tüm sayfa yapıları, metinler, grafik dili ve kullanıcı deneyimi tamamen tarafımızca üretildi. Biz "içerikleri siz verin" demiyoruz. Markayı analiz ediyor, sektörü öğreniyor ve en doğru anlatımı kendimiz kuruyoruz.

### 2. Profesyonel SEO Çalışması
Ana hedef kelimeler "Bursa Taş Parke" ve "Bursa Taş Parke Hizmetleri". Bu kelimelerde üst sıralara çıkmak için teknik SEO altyapısı kuruldu, sayfa başlıkları ve açıklamaları optimize edildi, site içi SEO mimarisi oluşturuldu, içerikler tamamen Google algoritmalarına uygun şekilde yazıldı. Sonuç: Google'da ilk sayfa başarısı sağlandı.

### 3. Hız Optimizasyonu & Mobil Uyumluluk
Web sitesi bilgisayar, tablet ve telefonlarda kusursuz görüntü veriyor; sektör ortalamasının çok üzerinde hız performansına ulaştı. Müşteri siteye tıkladığında beklemeden, anında açılan bir sistemle karşılaşıyor.

### 4. Kurumsal Galeri & Ürün Sunum Sistemi
Tüm uygulama örnekleri profesyonel galeri sistemiyle sunuldu, tüm taş çeşitleri web sitesine eklendi. Firma artık müşteriye gittiğinde web sitesini açıp kurumsal sunum yapabiliyor; ürünler, modeller ve uygulamalar tek bir ekranda prestijli biçimde gösteriliyor.

### 5. Logo & 3 Boyutlu Animasyonlu Video Çalışmaları
Marka için yepyeni profesyonel logo tasarlandı ve birbirinden farklı **3D animasyonlu logo videoları** üretildi. Artık marka, dijitalde ilk bakışta "Bu firma büyük, bu firma ciddi, bu firma güvenilir" diyor.

### 6. Kurumsal Kartvizit Tasarımı
Yeni logo ile uyumlu, prestijli ve profesyonel bir kartvizit tasarımı hazırlandı.

### 7. Sosyal Medya & YouTube Kurulumu
Müşteri isteği doğrultusunda Instagram ve Facebook sayfaları açıldı, platformlara özel logo ve profil görselleri hazırlandı, YouTube kanalı açıldı, drone çekimi yapılmış 4 profesyonel video yüklendi.

### 8. Google Haritalar Optimizasyonu
Google Business profili oluşturuldu, konum, kategori ve içerikler optimize edildi; firma artık Google Haritalar'da güçlü bir dijital vitrine sahip.

## Müşteri Yorumu
> "Dijital Roket ile çalışmaya başladığımız andan itibaren işimizin çehresi tamamen değişti. Biz sadece web sitesi istemiştik, onlar bize kurumsal bir marka inşa ettiler. İsteklerimizi yapıp geçmediler; sürekli 'nasıl daha iyi olur' diye düşünüp daha fazlasını sundular. Gönül rahatlığıyla herkese tavsiye ederim."
"""

METEHAN_CONTENT = """Otomotiv sektöründe güçlü bir marka olmanın yolu artık yalnızca iyi hizmet vermekten değil, **dijital dünyada da profesyonel görünmekten** geçiyor. Metehan Garaj için tam da bu vizyonla kapsamlı bir dijital dönüşüm süreci gerçekleştirdik.

## Metehan Garaj Kimdir?
İstanbul'un en büyük otomobil ticaret merkezlerinden biri olan **İSTOÇ İş Merkezi**'nde faaliyet gösteren Metehan Garaj, güvenli ve şeffaf otomobil alım-satım hizmetleri sunan profesyonel bir oto galeridir. Sektördeki tecrübesi ve titiz çalışma anlayışıyla, güvenle araç alıp satmak isteyen müşteriler için doğru adres olmayı hedeflemektedir.

## Metehan Garaj İçin Neler Yaptık?

### Profesyonel Web Sitesi Tasarımı
Metehan Garaj'a özel, **modern, hızlı ve mobil uyumlu** bir web sitesi tasarladık. Kullanıcıların aradığı bilgilere kolayca ulaşabildiği, marka algısını güçlendiren ve güven veren bir yapı oluşturduk.

Web sitesinde öne çıkanlar:
- Mobil ve tablet uyumlu tasarım
- Hızlı açılan, SEO altyapısı güçlü sayfalar
- Hizmetleri net anlatan sade kullanıcı deneyimi
- Kurumsal ve profesyonel görünüm

### Logo Tasarımı & Kurumsal Kimlik
Metehan Garaj'ın sektörüne ve vizyonuna uygun, **modern ve akılda kalıcı** bir logo tasarladık. Logonun dijital ve fiziksel tüm alanlarda sorunsuz kullanılabilmesi için kurumsal bir yapı oluşturduk.

### 3D Animasyonlu Logo Çalışması
Markanın gücünü daha etkili yansıtmak adına, logoyu 3D animasyonlu hale getirdik. Bu animasyon sosyal medya paylaşımlarında, video içeriklerde, açılış ve tanıtım videolarında markaya güçlü bir prestij kazandıracak şekilde hazırlandı.

### SEO (Arama Motoru Optimizasyonu) Çalışmaları
Anahtar kelime analizleri, sayfa içi SEO düzenlemeleri, teknik SEO altyapısı ve Google uyumlu içerik yapısı kuruldu. Amaç: Metehan Garaj'ın Google'da doğru kitleye, doğru zamanda ulaşması.

## Sonuç: Güçlü Bir Dijital Marka
Yapılan tüm bu çalışmalarla Metehan Garaj; dijitalde daha **kurumsal**, müşteri gözünde daha **güvenilir** ve Google'da daha **görünür** bir marka haline geldi.
"""

ABC_CONTENT = """Dijital dünyada güçlü bir görünürlük elde etmek isteyen markalar için **SEO ve sosyal medya yönetimi**, sürdürülebilir büyümenin en önemli iki unsurudur. Dijital Roket olarak **ABC İlk Yardım Eğitim Merkezi** için kapsamlı bir dijital büyüme çalışması başlattık.

## Projenin Amacı
ABC İlk Yardım Eğitim Merkezi için belirlenen temel hedefler şunlardır:
- "Bursa İlkyardım Eğitimi" aramasında üst sıralara çıkmak
- "Bursa İlkyardım Eğitim Merkezi" aramalarında güçlü görünürlük sağlamak
- Kurumsal firmaların insan kaynakları departmanlarından eğitim başvuruları almak
- Sosyal medya üzerinden güven veren bir marka algısı oluşturmak

## Yapılan SEO Çalışmaları

### 1. SEO Başlangıç Analizi
Çalışmanın ilk aşamasında web sitesinin mevcut durumu analiz edildi. Google Search Console kurulumu, anahtar kelime sıralama analizi, teknik site analizi ve Bursa bölgesindeki rakip firma incelemeleri gerçekleştirildi.

### 2. Teknik SEO Kurulumları
- Google Search Console kurulumu
- Google Analytics kurulumu
- WordPress Google Site Kit entegrasyonu

Bu kurulumlar sayesinde hangi kelimelerde kaçıncı sırada olunduğu, siteye hangi aramalardan trafik geldiği, tıklama ve gösterim sayıları, kullanıcı davranışları detaylı şekilde analiz edilebilir hale geldi.

### 3. Site İçi SEO Optimizasyonu
Ana sayfa SEO başlık ve açıklamalarının düzenlenmesi, hizmet sayfalarının güçlendirilmesi, Bursa odaklı anahtar kelime optimizasyonu, mobil uyumluluk ve site hızının iyileştirilmesi, iç link yapısının düzenlenmesi ve WordPress SEO ayarları yapıldı. Yapılan optimizasyonlar sonucunda sitenin **SEO skoru 60 seviyesinden 100 puana yükseltildi.**

### 4. Blog İçerik Stratejisi
Web sitesine **blog sistemi kuruldu ve SEO uyumlu içerikler oluşturuldu.** Hazırlanan içeriklerden bazıları:
- İşyerinde kaç ilk yardımcı bulundurmak zorunlu?
- İlk yardım sertifikası yenileme nasıl yapılır?
- Bursa'da ilk yardım eğitimi nasıl alınır?
- Temel ilk yardım eğitimi içeriği nedir?

## Beklenen Sonuçlar
- Google aramalarında görünürlük artışı
- Web sitesi ziyaretçi sayısında artış
- Kurumsal eğitim başvurularında artış
- Marka güveninin güçlenmesi
- Instagram erişim ve etkileşim artışı
- Dijital varlığın profesyonelleşmesi

Bu çalışmalar sayesinde ABC İlk Yardım Eğitim Merkezi'nin dijital dünyada daha güçlü bir konuma ulaşması hedeflenmektedir.
"""

ARSIYAD_CONTENT = """## ARSİYAD'ın Dijital Dönüşüm Yolculuğu — Sosyal Medya Yönetimi Dijital Roket'te
İş dünyasında saygın bir konuma sahip olan **ARSİYAD (Artvinli Sanayici ve İş İnsanları Derneği)**, uzun yıllardır iş insanları topluluğunu güçlendiren etkinliklere, networking fırsatlarına ve sektör içi paylaşımlara ev sahipliği yapmaktadır.

Günümüzün dijital çağında; kurumların güven veren, profesyonel ve etkili bir dijital varlığa sahip olması artık bir seçenek değil gerekliliktir. ARSİYAD da bu ihtiyacı fark ederek sosyal medya çalışmalarını **Dijital Roket'e emanet etme kararı** almıştır — çünkü kurumsal itibar, doğru dijital anlatımla taçlanır.

## Neden Sosyal Medya Yönetimini Dijital Roket'le Yürütüyorlar?
ARSİYAD gibi köklü bir topluluk:
- Kendi değerlerini dijitalde prestijli göstermek
- Üye paylaşımlarını profesyonelce sunmak
- Etkinliklerini ve iletişimlerini etkili şekilde duyurmak
- Sosyal medya dilini güçlendirmek

için yalnızca kaliteli içerik değil, aynı zamanda **stratejik bir iletişim partneri** arıyordu. Bu güven, Dijital Roket'e teslim edilen içerik ve sosyal medya yönetimi ile sonuç buldu.

## Dijital Roket'in ARSİYAD İçin Yaptığı Çalışmalar

### Profesyonel Görsel ve İçerik Üretimi
ARSİYAD'ın paylaşımları için üye tanıtım görselleri, etkinlik duyuruları, röportajlar, kurumsal mesajlar gibi tüm medya içeriği özgün şekilde tasarlanıyor. Her içerik; kurumsal kimlik, sektör dili ve hedef kitlenin beklentileri gözetilerek hazırlanıyor.

## Sizin İçin de Yapabiliriz!
Kurumsal sosyal medya içerikleriniz için profesyonel görsel tasarım, stratejik içerik planlama, paylaşım takvimi ve raporlama, marka kimliği ile uyumlu medya dili hizmetlerini sunuyoruz.

**Bizimle iletişime geçin: 0543 793 41 01**
"""

DRAI_CONTENT = """Dijital Roket tarafından geliştirilen **DR AI – Sosyal Medya Stüdyosu** artık Google Play ve App Store'da yayında! İşletmeler için sosyal medya yönetimini kökten değiştiren bu uygulama, ajanslara bağımlılığı ortadan kaldırıyor ve içerik üretimini tek panelden yönetilebilir hale getiriyor.

Artık haftalık içerik planı hazırlamak, kampanya görseli tasarlamak, logo oluşturmak ya da profesyonel kartvizit tasarlamak için dışarıya yüksek bütçeler ödemenize gerek yok. DR AI ile tüm süreç sizin kontrolünüzde.

## DR AI Nedir?
DR AI, küçük ve orta ölçekli işletmelerin, esnafların, girişimcilerin ve kurumsal firmaların sosyal medya içeriklerini yapay zeka desteğiyle üretmesini sağlayan akıllı bir dijital pazarlama uygulamasıdır. Bu sadece bir tasarım aracı değil; işletmeler için tam kapsamlı bir Sosyal Medya Stüdyosu çözümüdür.

Tek uygulama içerisinde içerik planlama, profesyonel tasarım, görsel üretimi, fotoğraf düzenleme ve marka kimliği oluşturma gibi tüm ihtiyaçlar karşılanır.

## DR AI'ın 6 Güçlü Özelliği

### 1) İçerik Planı Oluştur
Haftalık veya aylık sosyal medya paylaşım planınızı saniyeler içinde oluşturun. Hangi gün ne paylaşacağınızı düşünmenize gerek kalmaz. DR AI sektörünüze özel hazır planlar üretir.

### 2) Özel Görsel Oluştur
Kampanya, indirim, duyuru, dini bayramlar, resmi bayramlar ve özel günler için profesyonel tasarımlar üretin. İşletmenize özel metin ve tasarımlar tek dokunuşla hazır.

### 3) Hazır Görseller
Anında kullanılabilir profesyonel şablonlara erişin. Zamandan tasarruf edin, hızlı paylaşım yapın.

### 4) Fotoğraf Düzenle
Yapay zeka ile arka plan değiştirin, istenmeyen objeleri temizleyin, ürün fotoğraflarınızı profesyonel hale getirin. Stüdyo çekimi yaptırmaya gerek kalmaz.

### 5) Logo Oluştur
Dakikalar içinde kurumsal marka kimliği oluşturun. Yeni girişimler için hızlı ve etkili çözüm.

### 6) Kartvizit Oluştur
Profesyonel tasarım hazır. Baskıya uygun kartvizit çıktınızı alın ve markanızı güçlü şekilde temsil edin.

## Neden DR AI Bir Devrim?
Bugün birçok işletme sosyal medya ajanslarına aylık yüksek bütçeler ödüyor. İçerik üretimi, tasarım ve planlama süreçleri hem maliyetli hem de zaman alıcı.

DR AI ile:
- Ajans bağımlılığı sona erer
- İçerik üretimi sizin kontrolünüze geçer
- Zaman ve maliyet tasarrufu sağlanır
- Profesyonel tasarımlar dakikalar içinde hazırlanır
- Marka kimliği hızlıca oluşturulur

2026'da dijital dönüşüm artık bir seçenek değil, zorunluluk. DR AI bu dönüşümün anahtarıdır.

## DR AI Nereden İndirilir?
DR AI uygulaması resmi olarak Google Play Store ve Apple App Store'da yayındadır. İndirin, hesabınızı oluşturun ve işletmenizin dijital gücünü artırmaya hemen başlayın.

## Sonuç
Gelecek artık bekleyenlerin değil, üretenlerin. İşletmenizin sosyal medyasını kontrol altına alın. Kampanyalarınızı kendiniz oluşturun. Profesyonel içerikler üretin. **DR AI – Sosyal Medya Stüdyosu** ile dijital dönüşümünüzü bugün başlatın.
"""

DRAI2026_CONTENT = """Bir dönem sosyal medya, "olanın paylaştığı" bir alandı. Bugün ise **büyümek isteyen her işletme için zorunlu bir oyun alanı**. Ama bu oyunun kuralları artık eskisi gibi değil.

Ajanslar, haftalık planlar, günlerce beklenen tasarımlar, yüksek bütçeler… Uzun yıllar boyunca sosyal medya yönetimi bu şekilde ilerledi. Ta ki **yapay zekâ bu denklemin tam ortasına girene kadar**.

## Eski Model Artık Yetmiyor
Bugün birçok işletme aynı sorunları yaşıyor:
- Sosyal medyada görünür olmak zorunda ama nasıl ilerleyeceğini bilmiyor
- Ajanslarla çalışmak istiyor ama sürdürülebilir bütçeler ayıramıyor
- İçerik üretimi yavaş, tepkiler geç, sonuçlar belirsiz
- Sürecin kontrolü tamamen işletmenin elinden çıkıyor

Bu model artık ne hızlı, ne verimli, ne de ölçeklenebilir. Ve en önemlisi: bu model, bugünün temposuna ayak uyduramıyor.

## Kırılma Noktası: Yeni Nesil Yapay Zekâ — DR AI
2026'ya yaklaşırken net bir gerçek var: Sosyal medyada fark yaratan şey artık ekip sayısı değil, **sistem**.

Yapay zekâ sayesinde:
- İçerik fikirleri saniyeler içinde üretilebiliyor
- Görseller anında hazırlanabiliyor
- Kampanyalar hızlıca kurgulanabiliyor
- İşletmeler sürecin merkezine geri dönüyor

Bu, küçük bir iyileştirme değil. Bu, **oyunun tamamen değişmesi** demek.

## DR AI: Yeni Dönemin Sosyal Medya Stüdyosu
DR AI, bu değişimi erkenden gören ve buna göre geliştirilen bir sistemdir. Bir ajans gibi düşünen, ama bir uygulama kadar hızlı çalışan **yeni nesil bir sosyal medya stüdyosu**.

DR AI ile işletmeler:
- Sosyal medya içeriklerini kendileri oluşturabilir
- İşletmelerine özel görseller hazırlayabilir
- Kampanya ve duyurularını dakikalar içinde yayına alabilir
- Tasarım veya teknik bilgiye ihtiyaç duymadan süreci yönetebilir

Buradaki kritik fark şudur: **Kontrol tekrar işletmenin elindedir.**

## Bu Bir Alternatif Değil, Yeni Standart
DR AI, ajanslara karşı konumlanmaz. Ama şunu net söyler: Eski yöntemler artık tek yol değil.

Bugünün işletmeleri iki seçeneğe sahip:
- Ya eski modelle yavaş ve pahalı ilerleyecek
- Ya da yapay zekâ destekli sistemlerle hızlanacak

DR AI, ikinci yolu seçenler için geliştirildi.

## Dijital Roket Perspektifi
Dijital Roket olarak biz bu dönüşümü sadece izlemiyoruz. Bu dönüşümün **bir parçası değil, üreticisiyiz**. Strateji, büyüme, reklam ve dijital altyapı ihtiyaçlarında işletmelere uçtan uca çözümler sunmaya devam ediyoruz.

> **Sonuç:** Kurallar değişti, kazananlar değişime uyum sağlayanlar olacak. Sosyal medya artık sadece paylaşım yapmak değil. Hız, kontrol ve sürdürülebilirlik oyunu. Bu oyunun kuralları yeniden yazılıyor ve bu yeni döneme erken adapte olan işletmeler, birkaç yıl sonra farkı çok net hissedecek.
"""


PROJECTS = [
    {
        "slug": "namtas-bursa-dijital-donusum",
        "title": "Bursa Taş Parke NAMTAŞ — ROKETLENDİ",
        "client": "NAMTAŞ BURSA",
        "sector": "Üretim / İnşaat",
        "tags": ["Kurumsal Web", "SEO", "Logo", "3D Animasyon", "Google Haritalar"],
        "cover_image": "/projects/namtas.webp",
        "external_url": "https://namtasbursa.com",
        "need": "NAMTAŞ BURSA'nın hiç web sitesi yoktu, Instagram amatör kullanılıyordu, profesyonel logosu bulunmuyordu. Hedef; 'Bursa Taş Parke' aramasında Google'da ön sıralara çıkmak ve uçtan uca dijital bir sistemle kurumsal marka inşa etmekti.",
        "solution": "Özel altyapı üzerinde sıfırdan web sitesi, teknik+site içi SEO, hız optimizasyonu, kurumsal galeri/ürün sunum sistemi, yeni logo, 4 adet 3D animasyonlu kurumsal video, kartvizit tasarımı, Instagram-Facebook-YouTube hesapları + drone çekimleri ve Google Business profili.",
        "result": "Marka, dijitalde kurumsal, prestijli ve güven veren bir yapıya kavuştu. Google ilk sayfa konumu, sektör rekor hız puanı, saha satışında dahi kullanılabilen kurumsal sunum sistemi.",
        "content": NAMTAS_CONTENT,
        "gallery": [
            {"url": "/projects/namtas/web.webp", "caption": "www.namtasbursa.com – Yeni kurumsal web sitesi"},
            {"url": "/projects/namtas/google.webp", "caption": "Google arama sonuçları – ilk sayfa başarısı"},
            {"url": "/projects/namtas/hiz.webp", "caption": "Google hız puanı – sektörde REKOR"},
            {"url": "/projects/namtas/galeri.webp", "caption": "Galeri Sistemi"},
            {"url": "/projects/namtas/urunler.webp", "caption": "Ürünler Sistemi"},
            {"url": "/projects/namtas/logo-yeni.webp", "caption": "Yeni Logo – Kurumsal, Modern, İşi Anlatıyor"},
            {"url": "/projects/namtas/logo-eski.webp", "caption": "Eski Logo (önce/sonra karşılaştırması)"},
            {"url": "/projects/namtas/kartvizit1.webp", "caption": "Kartvizit Tasarımı 1"},
            {"url": "/projects/namtas/kartvizit2-on.webp", "caption": "Kartvizit Tasarımı 2 – Ön"},
            {"url": "/projects/namtas/kartvizit2-arka.webp", "caption": "Kartvizit Tasarımı 2 – Arka"},
            {"url": "/projects/namtas/youtube.webp", "caption": "YouTube kanalı"},
            {"url": "/projects/namtas/haritalar.webp", "caption": "Google Haritalar optimizasyonu"},
        ],
    },
    {
        "slug": "metehan-garaj-dijital-donusum",
        "title": "Metehan Garaj — ROKETLENDİ",
        "client": "Metehan Garaj",
        "sector": "Otomotiv",
        "tags": ["Kurumsal Web", "SEO", "Logo", "3D Animasyon"],
        "cover_image": "/projects/metehan-garaj.webp",
        "external_url": "https://www.metehangaraj.com",
        "need": "İstanbul İSTOÇ İş Merkezi'ndeki oto galerinin, dijital dünyada profesyonel görünmeye ve markalaşmaya ihtiyacı vardı.",
        "solution": "Modern, hızlı ve mobil uyumlu özel web sitesi, modern kurumsal logo + 3D animasyonlu logo, anahtar kelime analizi + site içi/teknik SEO altyapısı.",
        "result": "Metehan Garaj dijitalde daha kurumsal, müşteri gözünde daha güvenilir ve Google'da daha görünür bir marka haline geldi.",
        "content": METEHAN_CONTENT,
        "gallery": [
            {"url": "/projects/metehan/logo-banner.webp", "caption": "Metehan Garaj – Yeni kurumsal logo"},
        ],
    },
    {
        "slug": "abc-ilkyardim-seo-sosyal-medya",
        "title": "ABC İlk Yardım Eğitim Merkezi — ROKETLENDİ",
        "client": "ABC İlk Yardım Eğitim Merkezi",
        "sector": "Eğitim / Sağlık",
        "tags": ["SEO", "Sosyal Medya", "İçerik", "Blog Sistemi"],
        "cover_image": "/projects/abc-ilkyardim.webp",
        "need": "'Bursa İlkyardım Eğitimi' aramalarında üst sıralara çıkmak, kurumsal İK departmanlarından eğitim başvuruları almak ve sosyal medyada güven veren marka algısı oluşturmak.",
        "solution": "Search Console + Analytics + Site Kit kurulumu, anahtar kelime ve rakip analizi, teknik+site içi SEO, blog sistemi ve SEO uyumlu içerikler, Instagram için kapsamlı içerik planı.",
        "result": "SEO skoru 60'tan 100'e çıkarıldı — ilk yardım sektöründe REKOR. Google görünürlük ve eğitim başvurularında artış hedeflendi; dijital varlık profesyonelleşti.",
        "content": ABC_CONTENT,
        "gallery": [
            {"url": "/projects/abc/seo-score.webp", "caption": "SEO skoru 100 – ilk yardım sektöründe REKOR"},
        ],
    },
    {
        "slug": "arsiyad-sosyal-medya-yonetimi",
        "title": "ARSİYAD Sosyal Medya Yönetimi",
        "client": "ARSİYAD (Artvinli Sanayici ve İş İnsanları Derneği)",
        "sector": "Dernek / STK",
        "tags": ["Sosyal Medya", "İçerik Üretimi", "Kurumsal İletişim"],
        "cover_image": "/projects/arsiyad.webp",
        "need": "Köklü iş insanları derneği; kurumsal değerlerini dijitalde prestijli göstermek, üye paylaşımlarını profesyonelce sunmak ve etkinlikleri etkili şekilde duyurmak için stratejik bir iletişim partneri arıyordu.",
        "solution": "Üye tanıtım görselleri, etkinlik duyuruları, röportajlar, kurumsal mesajlar dahil tüm içerikler kurumsal kimliğe uygun şekilde özgün tasarlandı. Stratejik içerik planlama, paylaşım takvimi ve raporlama dahil uçtan uca yönetim.",
        "result": "ARSİYAD'ın dijital iletişim dili güçlendi; üye paylaşımları, etkinlikler ve kurumsal duyurular tutarlı ve prestijli bir hatla yayınlanıyor.",
        "content": ARSIYAD_CONTENT,
        "gallery": [
            {"url": "/projects/arsiyad/banner.webp", "caption": "ARSİYAD – Dijital Roket iş birliği"},
            {"url": "/projects/arsiyad/post1.webp", "caption": "Üye tanıtım paylaşımı"},
            {"url": "/projects/arsiyad/post2.webp", "caption": "Kurumsal mesaj"},
            {"url": "/projects/arsiyad/post3.webp", "caption": "Etkinlik duyurusu"},
            {"url": "/projects/arsiyad/post4.webp", "caption": "Üye röportajı"},
            {"url": "/projects/arsiyad/post5.webp", "caption": "Kurumsal içerik"},
            {"url": "/projects/arsiyad/post6.webp", "caption": "Üye tanıtım"},
            {"url": "/projects/arsiyad/post7.webp", "caption": "Sosyal medya görseli"},
        ],
    },
    {
        "slug": "dr-ai-yayinda-sosyal-medya-devrimi",
        "title": "DR AI Yayında! İşletmeler İçin Sosyal Medyada Devrim",
        "client": "Dijital Roket (Kendi Ürünümüz)",
        "sector": "AI / Sosyal Medya",
        "tags": ["DR AI", "Sosyal Medya", "Yapay Zeka", "Pazarlama"],
        "cover_image": "/projects/dr-ai-yayinda.webp",
        "external_url": "https://play.google.com/store/apps/details?id=com.dijitalroket.drai",
        "need": "KOBİ, esnaf, girişimci ve kurumsal firmaların sosyal medya içerik üretiminde yaşadığı zaman + maliyet + tasarımcı bağımlılığı sorununa kalıcı çözüm.",
        "solution": "DR AI; içerik planı, kampanya görseli, hazır şablon, fotoğraf düzenleme, logo ve kartvizit üretimini tek panelden yönetilebilir hale getiren akıllı sosyal medya stüdyosu olarak Google Play ve App Store'da yayına alındı.",
        "result": "Klasik ajans modelinde haftalarca süren içerik üretimi saatlere/dakikalara indi. Kullanıcılar kendi sosyal medyalarını yapay zeka ile profesyonelce yönetebiliyor.",
        "content": DRAI_CONTENT,
        "gallery": [
            {"url": "/projects/drai/feat1.webp", "caption": "İçerik Planı Oluştur"},
            {"url": "/projects/drai/feat2.webp", "caption": "Özel Görsel Oluştur"},
            {"url": "/projects/drai/feat3.webp", "caption": "Hazır Görseller"},
            {"url": "/projects/drai/feat4.webp", "caption": "Fotoğraf Düzenle"},
            {"url": "/projects/drai/feat5.webp", "caption": "Logo Oluştur"},
            {"url": "/projects/drai/feat6.webp", "caption": "Kartvizit Oluştur"},
            {"url": "/projects/drai/feat7.webp", "caption": "Uygulama ekran görüntüsü"},
        ],
    },
    {
        "slug": "dr-ai-2026-sosyal-medya-kurallari",
        "title": "Sosyal Medyanın Kuralları Yeniden Yazılıyor — DR AI 2026",
        "client": "Dijital Roket (Kendi Ürünümüz)",
        "sector": "AI / İçerik Üretimi",
        "tags": ["DR AI 2026", "AI", "Sosyal Medya", "İçerik"],
        "cover_image": "/projects/dr-ai-2026.webp",
        "need": "Klasik ajans modeli (haftalık planlar, günlerce beklenen tasarımlar, yüksek bütçeler) bugünün hız ihtiyacına yetişmiyor. Sosyal medya artık her işletme için zorunlu oyun alanı.",
        "solution": "DR AI 2026 sürümü; markaya özel üretim hattı, akıllı kampanya görseli üretimi, dinamik içerik planlama ve marka dili öğrenen prompt mimarisiyle yeniden kurgulandı. İşletme talep edince anında çalışan model.",
        "result": "Sosyal medya yönetiminde yeni standart oluştu: ajansa bağımlı olmadan, marka kimliğini koruyarak, ölçeklenebilir hızda içerik üretimi. DR AI 2026, Dijital Roket'in pazarlama hızı stratejisinin motoru.",
        "content": DRAI2026_CONTENT,
        "gallery": [
            {"url": "/projects/drai2026/hero1.webp", "caption": "Eski model artık yetmiyor"},
            {"url": "/projects/drai2026/hero2.webp", "caption": "Kırılma noktası: yeni nesil yapay zekâ"},
            {"url": "/projects/drai2026/g1.webp", "caption": "DR AI – uygulama ekranı"},
            {"url": "/projects/drai2026/g2.webp", "caption": "İçerik üretim akışı"},
            {"url": "/projects/drai2026/g3.webp", "caption": "Kampanya görseli üretimi"},
            {"url": "/projects/drai2026/g4.webp", "caption": "Marka kimliği oluşturma"},
            {"url": "/projects/drai2026/g5.webp", "caption": "Profesyonel tasarım çıktıları"},
        ],
    },
]


async def main():
    client = AsyncIOMotorClient(os.environ["MONGO_URL"])
    db = client[os.environ["DB_NAME"]]
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
    print(f"Inserted {len(result.inserted_ids)} projects (with rich content + galleries)")
    await db.config.update_one({"_id": "seed"}, {"$set": {"real_projects_seeded": True}}, upsert=True)
    client.close()


if __name__ == "__main__":
    asyncio.run(main())
