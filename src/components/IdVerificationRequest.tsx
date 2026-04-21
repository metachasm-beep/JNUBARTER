"use client";

import { useState } from "react";
import { Upload, FileText, CheckCircle2, Loader2, Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function IdVerificationRequest({ 
  isOpen, 
  onClose,
  onSuccess
}: { 
  isOpen?: boolean; 
  onClose?: () => void;
  onSuccess?: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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
      toast.success("ID Uploaded", { description: "Your JNU ID is now awaiting admin review." });
      onSuccess?.();
      onClose?.();
    } catch (err: any) {
      toast.error("Upload Failed", { description: err.message });
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose?.()}>
      <DialogContent className="max-w-2xl bg-stone-50 rounded-[3rem] border-stone-200 p-0 overflow-hidden">
        <DialogHeader className="p-8 pb-4 bg-white border-b border-stone-100">
           <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-accent" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-primary">Authority Intel Request</DialogTitle>
                <DialogDescription className="text-xs text-stone-500 font-medium mt-1">Upload your JNU Student ID for deep verification.</DialogDescription>
              </div>
           </div>
        </DialogHeader>

        <div className="p-8 space-y-8">
          {!preview ? (
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-stone-200 rounded-[2rem] bg-stone-100/30 hover:bg-stone-100/50 cursor-pointer transition-all group">
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
      </DialogContent>
    </Dialog>
  );
}
