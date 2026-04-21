"use client";

import { useState } from "react";
import { Upload, FileText, CheckCircle2, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function IdVerificationRequest() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
    }
  };

  const handleUpload = async () => {
    if (!preview) return;

    setIsUploading(true);
    try {
      // We send the Base64 string to the server
      // In a real app, you'd upload to S3/Cloudinary first
      const res = await fetch("/api/user/upload-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idCardBase64: preview })
      });

      if (!res.ok) throw new Error(await res.text());

      setIsSuccess(true);
      toast.success("ID Uploaded", { description: "Your JNU ID is now awaiting admin review." });
    } catch (err: any) {
      toast.error("Upload Failed", { description: err.message });
    } finally {
      setIsUploading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-primary text-white p-8 rounded-[2.5rem] flex items-center gap-6 shadow-2xl shadow-primary/20">
        <CheckCircle2 className="h-10 w-10 text-accent animate-in zoom-in" />
        <div>
          <h3 className="text-xl font-black uppercase italic tracking-tighter leading-tight">Verification Pending</h3>
          <p className="text-xs opacity-70 font-medium">Your credentials have been submitted to the protocol authority for review.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-10 rounded-[3rem] border-stone-200 bg-white/60 space-y-8">
      <div className="space-y-2">
        <h3 className="text-2xl font-black uppercase italic tracking-tighter text-primary">Authority Intel Request</h3>
        <p className="text-sm text-stone-500 font-medium">Upload a clear photo of your JNU Student ID Card to unlock deep verification status.</p>
      </div>

      {!preview ? (
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-stone-200 rounded-[2rem] bg-stone-50/50 hover:bg-stone-100/50 cursor-pointer transition-all group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-10 h-10 mb-4 text-stone-300 group-hover:text-primary transition-colors" />
            <p className="mb-2 text-sm text-stone-500 font-bold uppercase tracking-tight">Drop your ID photo here</p>
            <p className="text-xs text-stone-400 font-mono">PNG, JPG or WEBP (Max 2MB)</p>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        </label>
      ) : (
        <div className="space-y-6">
          <div className="relative aspect-[1.58/1] w-full rounded-[2rem] overflow-hidden border border-stone-200 shadow-inner bg-stone-100">
             <img src={preview} alt="ID Preview" className="w-full h-full object-cover" />
             <button 
              onClick={() => { setPreview(null); setFile(null); }}
              className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white p-2 rounded-full hover:bg-black transition-colors"
             >
               <Upload className="h-4 w-4" />
             </button>
          </div>
          <Button 
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full h-16 rounded-2xl btn-premium text-white font-black uppercase tracking-widest text-sm"
          >
            {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Submit for Review"}
          </Button>
        </div>
      )}
    </div>
  );
}
