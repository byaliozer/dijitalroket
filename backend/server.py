from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import logging
import uuid
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, status, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict

# -----------------------------------------------------------------------------
# DB setup
# -----------------------------------------------------------------------------
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_ALGORITHM = "HS256"
JWT_SECRET = os.environ['JWT_SECRET']

app = FastAPI(title="Dijital Roket API")
api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# -----------------------------------------------------------------------------
# Auth helpers
# -----------------------------------------------------------------------------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(days=1),
        "type": "access",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    if not credentials:
        raise HTTPException(status_code=401, detail="Yetkilendirme gerekli")
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Geçersiz token")
        user = await db.users.find_one({"id": user_id}, {"_id": 0, "password_hash": 0})
        if not user or user.get("role") != "admin":
            raise HTTPException(status_code=401, detail="Yetkisiz")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Oturum süresi doldu")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Geçersiz token")


# -----------------------------------------------------------------------------
# Models
# -----------------------------------------------------------------------------
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    token: str
    user: dict


class ContactForm(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    company: Optional[str] = ""
    phone: Optional[str] = ""
    email: EmailStr
    project_type: Optional[str] = ""
    budget: Optional[str] = ""
    message: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    status: str = "new"


class ContactCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    company: Optional[str] = ""
    phone: Optional[str] = ""
    email: EmailStr
    project_type: Optional[str] = ""
    budget: Optional[str] = ""
    message: str = Field(min_length=10, max_length=4000)


class ProjectRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    company_name: str
    contact_name: str
    email: EmailStr
    phone: Optional[str] = ""
    current_digital_state: Optional[str] = ""
    project_type: str
    goals: Optional[str] = ""
    user_roles: Optional[str] = ""
    required_features: Optional[str] = ""
    reference_systems: Optional[str] = ""
    timeline: Optional[str] = ""
    budget: Optional[str] = ""
    notes: Optional[str] = ""
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    status: str = "new"


class ProjectRequestCreate(BaseModel):
    company_name: str = Field(min_length=2, max_length=200)
    contact_name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = ""
    current_digital_state: Optional[str] = ""
    project_type: str
    goals: Optional[str] = ""
    user_roles: Optional[str] = ""
    required_features: Optional[str] = ""
    reference_systems: Optional[str] = ""
    timeline: Optional[str] = ""
    budget: Optional[str] = ""
    notes: Optional[str] = ""


class BlogPost(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str
    title: str
    excerpt: str
    content: str
    category: str
    cover_image: Optional[str] = ""
    read_time: int = 5
    published: bool = True
    seo_title: Optional[str] = ""
    seo_description: Optional[str] = ""
    tags: List[str] = []
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class BlogPostCreate(BaseModel):
    slug: str
    title: str
    excerpt: str
    content: str
    category: str
    cover_image: Optional[str] = ""
    read_time: int = 5
    published: bool = True
    seo_title: Optional[str] = ""
    seo_description: Optional[str] = ""
    tags: List[str] = []


class CaseStudy(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str
    title: str
    client: str
    sector: str
    tags: List[str] = []
    need: str
    solution: str
    result: str
    cover_image: Optional[str] = ""
    content: Optional[str] = ""
    gallery: List[dict] = []
    external_url: Optional[str] = ""
    seo_title: Optional[str] = ""
    seo_description: Optional[str] = ""
    published: bool = True
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class CaseStudyCreate(BaseModel):
    slug: str
    title: str
    client: str
    sector: str
    tags: List[str] = []
    need: str
    solution: str
    result: str
    cover_image: Optional[str] = ""
    content: Optional[str] = ""
    gallery: List[dict] = []
    external_url: Optional[str] = ""
    seo_title: Optional[str] = ""
    seo_description: Optional[str] = ""
    published: bool = True


# -----------------------------------------------------------------------------
# Routes - Public
# -----------------------------------------------------------------------------
@api_router.get("/")
async def root():
    return {"service": "Dijital Roket API", "status": "ok"}


@api_router.post("/auth/login", response_model=LoginResponse)
async def login(payload: LoginRequest):
    email = payload.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="E-posta veya şifre hatalı")
    token = create_access_token(user["id"], user["email"])
    safe_user = {k: v for k, v in user.items() if k not in ("_id", "password_hash")}
    return {"token": token, "user": safe_user}


@api_router.get("/auth/me")
async def me(current=Depends(get_current_admin)):
    return current


# -----------------------------------------------------------------------------
# Admin file uploads (images for blog/projects)
# -----------------------------------------------------------------------------
UPLOAD_DIR = Path("/app/frontend/public/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
ALLOWED_IMAGE_TYPES = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
}
MAX_UPLOAD_BYTES = 8 * 1024 * 1024  # 8 MB


@api_router.post("/admin/upload")
async def admin_upload(file: UploadFile = File(...), current=Depends(get_current_admin)):
    content_type = (file.content_type or "").lower()
    ext = ALLOWED_IMAGE_TYPES.get(content_type)
    if not ext:
        raise HTTPException(status_code=400, detail="Sadece JPG, PNG, WEBP veya GIF görseller yüklenebilir.")
    data = await file.read()
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=400, detail="Görsel 8MB'dan büyük olamaz.")
    if len(data) == 0:
        raise HTTPException(status_code=400, detail="Boş dosya yüklenemez.")
    name = f"{uuid.uuid4().hex}{ext}"
    (UPLOAD_DIR / name).write_bytes(data)
    return {"url": f"/uploads/{name}", "size": len(data), "filename": name}


@api_router.post("/contact", response_model=ContactForm)
async def submit_contact(payload: ContactCreate):
    obj = ContactForm(**payload.model_dump())
    doc = obj.model_dump()
    await db.contacts.insert_one(doc)
    doc.pop("_id", None)
    return obj


@api_router.post("/project-request", response_model=ProjectRequest)
async def submit_project_request(payload: ProjectRequestCreate):
    obj = ProjectRequest(**payload.model_dump())
    doc = obj.model_dump()
    await db.project_requests.insert_one(doc)
    return obj


@api_router.get("/blog", response_model=List[BlogPost])
async def list_blog(category: Optional[str] = None, limit: int = 50):
    q = {"published": True}
    if category:
        q["category"] = category
    items = await db.blog_posts.find(q, {"_id": 0}).sort("created_at", -1).limit(limit).to_list(limit)
    return items


@api_router.get("/blog/{slug}", response_model=BlogPost)
async def get_blog(slug: str):
    item = await db.blog_posts.find_one({"slug": slug, "published": True}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="Yazı bulunamadı")
    return item


@api_router.get("/projects", response_model=List[CaseStudy])
async def list_projects(tag: Optional[str] = None, limit: int = 50):
    q = {"published": True}
    if tag:
        q["tags"] = tag
    items = await db.case_studies.find(q, {"_id": 0}).sort("created_at", -1).limit(limit).to_list(limit)
    return items


@api_router.get("/projects/{slug}", response_model=CaseStudy)
async def get_project(slug: str):
    item = await db.case_studies.find_one({"slug": slug, "published": True}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="Proje bulunamadı")
    return item


# -----------------------------------------------------------------------------
# Routes - Admin
# -----------------------------------------------------------------------------
@api_router.get("/admin/stats")
async def admin_stats(current=Depends(get_current_admin)):
    contacts_count = await db.contacts.count_documents({})
    new_contacts = await db.contacts.count_documents({"status": "new"})
    project_requests_count = await db.project_requests.count_documents({})
    new_requests = await db.project_requests.count_documents({"status": "new"})
    blog_count = await db.blog_posts.count_documents({})
    case_count = await db.case_studies.count_documents({})
    return {
        "contacts_total": contacts_count,
        "contacts_new": new_contacts,
        "project_requests_total": project_requests_count,
        "project_requests_new": new_requests,
        "blog_posts": blog_count,
        "case_studies": case_count,
    }


@api_router.get("/admin/contacts", response_model=List[ContactForm])
async def admin_list_contacts(current=Depends(get_current_admin)):
    return await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)


@api_router.patch("/admin/contacts/{contact_id}")
async def admin_update_contact(contact_id: str, status_value: str, current=Depends(get_current_admin)):
    result = await db.contacts.update_one({"id": contact_id}, {"$set": {"status": status_value}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Kayıt bulunamadı")
    return {"ok": True}


@api_router.delete("/admin/contacts/{contact_id}")
async def admin_delete_contact(contact_id: str, current=Depends(get_current_admin)):
    await db.contacts.delete_one({"id": contact_id})
    return {"ok": True}


@api_router.get("/admin/project-requests", response_model=List[ProjectRequest])
async def admin_list_requests(current=Depends(get_current_admin)):
    return await db.project_requests.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)


@api_router.delete("/admin/project-requests/{req_id}")
async def admin_delete_request(req_id: str, current=Depends(get_current_admin)):
    await db.project_requests.delete_one({"id": req_id})
    return {"ok": True}


@api_router.post("/admin/blog", response_model=BlogPost)
async def admin_create_blog(payload: BlogPostCreate, current=Depends(get_current_admin)):
    obj = BlogPost(**payload.model_dump())
    await db.blog_posts.insert_one(obj.model_dump())
    return obj


@api_router.put("/admin/blog/{post_id}", response_model=BlogPost)
async def admin_update_blog(post_id: str, payload: BlogPostCreate, current=Depends(get_current_admin)):
    update = payload.model_dump()
    update["updated_at"] = datetime.now(timezone.utc).isoformat()
    result = await db.blog_posts.find_one_and_update(
        {"id": post_id}, {"$set": update}, return_document=True, projection={"_id": 0}
    )
    if not result:
        raise HTTPException(status_code=404, detail="Yazı bulunamadı")
    return result


@api_router.delete("/admin/blog/{post_id}")
async def admin_delete_blog(post_id: str, current=Depends(get_current_admin)):
    await db.blog_posts.delete_one({"id": post_id})
    return {"ok": True}


@api_router.get("/admin/blog", response_model=List[BlogPost])
async def admin_list_blog(current=Depends(get_current_admin)):
    return await db.blog_posts.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)


@api_router.post("/admin/projects", response_model=CaseStudy)
async def admin_create_project(payload: CaseStudyCreate, current=Depends(get_current_admin)):
    obj = CaseStudy(**payload.model_dump())
    await db.case_studies.insert_one(obj.model_dump())
    return obj


@api_router.put("/admin/projects/{proj_id}", response_model=CaseStudy)
async def admin_update_project(proj_id: str, payload: CaseStudyCreate, current=Depends(get_current_admin)):
    result = await db.case_studies.find_one_and_update(
        {"id": proj_id}, {"$set": payload.model_dump()}, return_document=True, projection={"_id": 0}
    )
    if not result:
        raise HTTPException(status_code=404, detail="Proje bulunamadı")
    return result


@api_router.delete("/admin/projects/{proj_id}")
async def admin_delete_project(proj_id: str, current=Depends(get_current_admin)):
    await db.case_studies.delete_one({"id": proj_id})
    return {"ok": True}


@api_router.get("/admin/projects", response_model=List[CaseStudy])
async def admin_list_projects(current=Depends(get_current_admin)):
    return await db.case_studies.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)


# -----------------------------------------------------------------------------
# Site Settings (single doc, editable from admin)
# -----------------------------------------------------------------------------
DEFAULT_SETTINGS = {
    "site_title": "Dijital Roket | DR AI Destekli Kurumsal Dijital Dönüşüm",
    "site_description": "Dijital Roket; DR AI destekli üretim sistemiyle kurumsal web siteleri, B2B paneller, CRM benzeri sistemler, sosyal medya içerikleri ve özel dijital projeler geliştirir.",
    "favicon_url": "",
    "og_image": "",
    "pages": {
        "home":    {"title": "", "description": ""},
        "about":   {"title": "Hakkımızda | Dijital Roket", "description": "Dijital Roket; 2015'ten bu yana Bursa merkezli AI destekli dijital dönüşüm şirketidir."},
        "contact": {"title": "İletişim | Dijital Roket", "description": "Dijital Roket ile iletişime geçin. Bursa merkezli kurumsal dijital dönüşüm ortağınız."},
        "projects":{"title": "Projeler | Dijital Roket DR AI Çalışmaları", "description": "Web, B2B, AI ve dijital dönüşüm projelerimizden seçtiğimiz vaka çalışmaları."},
        "blog":    {"title": "Blog | Dijital Roket İçgörüler", "description": "Dijital dönüşüm, AI, kurumsal web, B2B sistemler ve CRM üzerine içgörüler."},
    },
    "contact_phone": "0543 793 41 01",
    "contact_phone_link": "+905437934101",
    "contact_email": "byaliozer@gmail.com",
    "contact_address": "Bursa, Türkiye",
    "social_linkedin": "",
    "social_instagram": "https://www.instagram.com/dijital.roket/",
    "social_twitter": "",
    "app_google_play": "https://play.google.com/store/apps/details?id=com.dijitalroket.drai",
    "app_app_store": "https://apps.apple.com/br/app/dr-ai-sosyal-medya-st%C3%BCdyosu/id6758508361",
    "about_eyebrow": "Hakkımızda",
    "about_title": "Dijital Dönüşümü Hızlandıran Teknoloji Ekibi",
    "about_hero_image": "https://images.unsplash.com/photo-1758518729685-f88df7890776?w=1200&q=80",
    "about_content": (
        "## 2015'ten Bu Yana Markaların Dijital Çözüm Ortağı\n\n"
        "Dijital Roket, 2015'ten bu yana markaların dijital dünyada daha güçlü görünmesi ve daha verimli çalışması için çözümler üreten Bursa merkezli bir teknoloji ve dijital dönüşüm şirketidir.\n\n"
        "Bugün Dijital Roket; web tasarımı, özel yazılım, sosyal medya, içerik üretimi, AI destekli görsel üretimi, B2B sistemler, CRM benzeri paneller ve kurumsal dijital dönüşüm projelerini tek çatı altında sunar.\n\n"
        "Amacımız sadece güzel görünen işler yapmak değil; şirketlerin satış, operasyon, pazarlama ve müşteri yönetimi süreçlerini daha hızlı, ölçülebilir ve profesyonel hale getirmektir.\n\n"
        "## Değerlerimiz\n\n"
        "- Hız\n- Güven\n- Strateji\n- Teknoloji\n- Sürekli gelişim\n- Sonuç odaklılık"
    ),
}


@api_router.get("/settings")
async def get_settings():
    doc = await db.settings.find_one({"_id": "default"})
    if not doc:
        return DEFAULT_SETTINGS
    doc.pop("_id", None)
    return doc


@api_router.put("/admin/settings")
async def update_settings(payload: dict, current=Depends(get_current_admin)):
    # Whitelist top-level keys
    allowed = {
        "site_title", "site_description", "favicon_url", "og_image", "pages",
        "contact_phone", "contact_phone_link", "contact_email", "contact_address",
        "social_linkedin", "social_instagram", "social_twitter",
        "app_google_play", "app_app_store",
        "about_eyebrow", "about_title", "about_hero_image", "about_content",
    }
    clean = {k: v for k, v in payload.items() if k in allowed}
    await db.settings.update_one(
        {"_id": "default"},
        {"$set": clean},
        upsert=True,
    )
    doc = await db.settings.find_one({"_id": "default"})
    doc.pop("_id", None)
    return doc


async def seed_settings():
    existing = await db.settings.find_one({"_id": "default"})
    if not existing:
        await db.settings.insert_one({"_id": "default", **DEFAULT_SETTINGS})
        logger.info("Default settings seeded")


# -----------------------------------------------------------------------------
# Seed
# -----------------------------------------------------------------------------
SEED_BLOG_POSTS = [
    {
        "slug": "sirketinizde-hangi-surecler-dijitallestirilmeli",
        "title": "Şirketinizde Hangi Süreçler Dijitalleştirilmeli?",
        "excerpt": "Operasyonel yükü azaltan, satış ve müşteri yönetimini hızlandıran süreçleri nasıl belirlersiniz?",
        "content": "Şirketlerde dijitalleşme yalnızca web sitesi yenilemekle sınırlı değildir. Satış süreçleri, teklif yönetimi, müşteri görüşmeleri, bayi siparişleri ve raporlama gibi tekrar eden iş akışları çoğu zaman dijitalleştirilebilir. Bu yazıda, hangi süreçlerin sistemleşmeye en uygun olduğunu ve nereden başlanması gerektiğini ele alıyoruz.\n\nİlk adım, ekibinizin gün içinde en çok zaman harcadığı manuel iş akışlarını listelemektir. Ardından bu akışlar için bir öncelik matrisi çıkarılır ve etki/maliyet dengesine göre dijitalleştirme yol haritası oluşturulur.",
        "category": "Dijital Dönüşüm",
        "cover_image": "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80",
        "read_time": 6,
    },
    {
        "slug": "crm-benzeri-ozel-sistemler-sirketlere-ne-kazandirir",
        "title": "CRM Benzeri Özel Sistemler Şirketlere Ne Kazandırır?",
        "excerpt": "Hazır paket CRM'lerin yerine şirketinize özel müşteri takip sistemi neden daha verimlidir?",
        "content": "Hazır CRM çözümleri çoğu zaman şirketinizin iş akışına tam oturmaz. Kullanılmayan modüller, zorlama özelleştirmeler ve aylık lisans maliyetleri uzun vadede yük oluşturur. DR AI üretim sistemiyle geliştirilen özel müşteri takip panelleri ise yalnızca ihtiyacınız olan modülleri içerir.\n\nÖzel sistemlerin avantajları arasında; ekibinizin alışkanlıklarına uyumluluk, raporlama esnekliği, satış hunisinin görselleştirilmesi ve bayi/distribütör entegrasyonu yer alır.",
        "category": "CRM ve Müşteri Yönetimi",
        "cover_image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
        "read_time": 7,
    },
    {
        "slug": "b2b-bayi-sistemi-nedir",
        "title": "B2B Bayi Sistemi Nedir ve Hangi Firmalar İçin Gereklidir?",
        "excerpt": "Bayi ağı olan üretici ve toptancı firmalar için B2B paneller artık standart bir ihtiyaç.",
        "content": "B2B bayi sistemleri; üretici, toptancı veya distribütör firmaların bayi ağıyla dijital ortamda sipariş, fiyat, stok ve kampanya yönetimini sağlayan özel panellerdir.\n\nMobilya, halı, otomotiv yedek parça, gıda, tekstil ve inşaat malzemeleri gibi sektörlerde B2B panel; sipariş hatalarını azaltır, sahaya bağımlılığı ortadan kaldırır ve bayilerin daha verimli çalışmasını sağlar.",
        "category": "B2B Sistemler",
        "cover_image": "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&q=80",
        "read_time": 5,
    },
    {
        "slug": "kurumsal-web-sitesi-tanitim-sayfasi-degil",
        "title": "Kurumsal Web Sitesi Artık Neden Sadece Tanıtım Sayfası Değil?",
        "excerpt": "2026'da kurumsal web siteleri; başvuru, müşteri kabul, kampanya ve operasyon merkezine dönüşüyor.",
        "content": "Modern kurumsal web siteleri yalnızca markayı tanıtmaz; aynı zamanda potansiyel müşteriden gelen başvuruları toplar, talepleri kategorize eder, kampanya yönetir ve CRM benzeri panellere veri sağlar.\n\nDoğru kurgulandığında bir web sitesi; ekibinizin operasyonel yükünü azaltır, müşteri deneyimini standartlaştırır ve dönüşüm oranını ciddi şekilde artırır.",
        "category": "Kurumsal Web",
        "cover_image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
        "read_time": 6,
    },
    {
        "slug": "ai-destekli-icerik-uretimi",
        "title": "AI Destekli İçerik Üretimi Şirketlerin Pazarlama Hızını Nasıl Artırır?",
        "excerpt": "Sosyal medya, blog ve kampanya görsellerinde DR AI üretim sistemi ne fark yaratıyor?",
        "content": "Geleneksel içerik üretimi süreci; brief alma, taslak oluşturma, revizyon, görsel hazırlama ve onay aşamalarıyla günler sürebilir. DR AI üretim sistemi bu süreçleri sıkıştırır; aynı kaliteyi koruyarak teslim süresini önemli ölçüde kısaltır.\n\nMetin, görsel, kampanya konsepti ve kurumsal şablon üretimi tek bir akışta yönetildiğinde, pazarlama ekipleri stratejiye daha çok zaman ayırabilir.",
        "category": "Sosyal Medya Otomasyonu",
        "cover_image": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80",
        "read_time": 5,
    },
]

SEED_CASE_STUDIES = [
    {
        "slug": "livanespor-kurumsal-web-donusumu",
        "title": "Livanespor Kurumsal Web Dönüşümü",
        "client": "Livanespor",
        "sector": "Spor Kulübü",
        "tags": ["Kurumsal Web", "Spor", "Hızlı Yayın"],
        "need": "Modern, mobil uyumlu ve kulüp kimliğini yansıtan profesyonel bir web sitesi.",
        "solution": "DR AI destekli içerik, görsel, sayfa yapısı ve modern web tasarımı tek sprint içinde tamamlandı.",
        "result": "Kısa sürede yayına hazır güçlü kulüp web sitesi ve düzenli içerik üretim altyapısı.",
        "cover_image": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80",
    },
    {
        "slug": "evser-hali-b2b-sistem-prototipi",
        "title": "Evser Halı B2B Sistem Prototipi",
        "client": "Evser Halı",
        "sector": "Halı / Üretim",
        "tags": ["B2B", "Halı", "Bayi Sistemi"],
        "need": "Ürün, koleksiyon ve bayi sipariş süreçlerini dijitalleştirecek bir yapı.",
        "solution": "Web sitesi ve B2B panel mantığını aynı sistemde kurgulayan hızlı prototip ile bayilerin doğrudan sipariş verebilmesi sağlandı.",
        "result": "Saatler içinde çalışan ilk sistem akışı ve ölçeklenebilir B2B altyapı.",
        "cover_image": "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1200&q=80",
    },
    {
        "slug": "dr-ai-sosyal-medya-studyosu",
        "title": "DR AI Sosyal Medya Stüdyosu",
        "client": "Dijital Roket",
        "sector": "AI / İçerik Üretimi",
        "tags": ["AI", "Sosyal Medya", "İçerik Üretimi"],
        "need": "İşletmelerin kendi sosyal medya içeriklerini hızlıca üretebilmesi.",
        "solution": "İçerik planı, kampanya görseli, logo, kartvizit ve sosyal medya üretim araçlarını tek panele topladık.",
        "result": "Dijital Roket'in kendi AI ürün ekosistemi ve müşterilere açılan üretim hattı.",
        "cover_image": "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1200&q=80",
    },
    {
        "slug": "abc-ilk-yardim-dijital-gorunurluk",
        "title": "ABC İlk Yardım Dijital Görünürlük",
        "client": "ABC İlk Yardım",
        "sector": "Eğitim / Sağlık",
        "tags": ["SEO", "Kurumsal İçerik", "Sosyal Medya"],
        "need": "Eğitim merkezinin dijitalde daha güçlü görünmesi ve içerik üretiminin profesyonelleşmesi.",
        "solution": "SEO uyumlu içerik, sosyal medya planları ve kurumsal dijital yönetim süreçleri kurgulandı.",
        "result": "Daha güçlü marka algısı, organik trafikte artış ve düzenli dijital iletişim.",
        "cover_image": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80",
    },
]


async def seed_admin():
    email = os.environ.get("ADMIN_EMAIL", "admin@dijitalroket.com").lower()
    password = os.environ.get("ADMIN_PASSWORD", "Roket2026!")
    existing = await db.users.find_one({"email": email})
    if not existing:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": email,
            "password_hash": hash_password(password),
            "name": "Dijital Roket Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("Admin user seeded: %s", email)
    elif not verify_password(password, existing.get("password_hash", "")):
        await db.users.update_one({"email": email}, {"$set": {"password_hash": hash_password(password)}})
        logger.info("Admin password updated")


async def seed_content():
    for post in SEED_BLOG_POSTS:
        if not await db.blog_posts.find_one({"slug": post["slug"]}):
            obj = BlogPost(**post)
            await db.blog_posts.insert_one(obj.model_dump())
    # Only seed demo case studies if no real-project flag is set (one-time real seed via script)
    flag = await db.config.find_one({"_id": "seed"})
    if not (flag and flag.get("real_projects_seeded")):
        for case in SEED_CASE_STUDIES:
            if not await db.case_studies.find_one({"slug": case["slug"]}):
                obj = CaseStudy(**case)
                await db.case_studies.insert_one(obj.model_dump())
    logger.info("Seed content ensured")


@app.on_event("startup")
async def on_startup():
    try:
        await db.users.create_index("email", unique=True)
        await db.blog_posts.create_index("slug", unique=True)
        await db.case_studies.create_index("slug", unique=True)
    except Exception as e:
        logger.warning("Index creation: %s", e)
    await seed_admin()
    await seed_content()
    await seed_settings()


@app.on_event("shutdown")
async def on_shutdown():
    client.close()


app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)
