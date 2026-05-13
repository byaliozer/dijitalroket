import { useRef, useState } from "react";
import { toast } from "sonner";
import { Upload, Loader2, X, Image as ImageIcon } from "lucide-react";
import { api, formatApiError } from "../lib/api";

/**
 * Reusable image uploader.
 * Props:
 *   value: current image URL (string)
 *   onChange: (url: string) => void
 *   label: optional label
 *   compact: smaller preview (for gallery items)
 */
export default function ImageUploader({ value, onChange, label = "Görsel", compact = false }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const upload = async (file) => {
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Görsel 8MB'dan büyük olamaz.");
      return;
    }
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const { data } = await api.post("/admin/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange(data.url);
      toast.success("Görsel yüklendi");
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || err.message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const pick = () => inputRef.current?.click();

  return (
    <div className="block">
      {label && <span className="block text-xs font-semibold text-[#07111F] mb-1.5">{label}</span>}
      <div className={`flex items-start gap-3 ${compact ? "" : ""}`}>
        {value ? (
          <div className={`relative shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 ${compact ? "h-20 w-28" : "h-28 w-40"}`}>
            <img src={value} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute top-1 right-1 inline-flex h-6 w-6 items-center justify-center rounded-md bg-black/60 text-white hover:bg-black/80"
              title="Görseli kaldır"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className={`flex shrink-0 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-slate-400 ${compact ? "h-20 w-28" : "h-28 w-40"}`}>
            <ImageIcon className="h-6 w-6" />
          </div>
        )}

        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <button
            type="button"
            onClick={pick}
            disabled={uploading}
            data-testid="image-upload-btn"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#07111F] hover:border-[#2563EB] hover:text-[#2563EB] transition disabled:opacity-50"
          >
            {uploading ? <><Loader2 className="h-4 w-4 animate-spin" /> Yükleniyor</> : <><Upload className="h-4 w-4" /> Bilgisayardan Seç</>}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={(e) => upload(e.target.files?.[0])}
          />
          <input
            type="url"
            placeholder="veya URL yapıştırın"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-[#2563EB] truncate"
          />
        </div>
      </div>
    </div>
  );
}
