import { supabase } from "./supabase";

export const compressAndUploadImage = async (file: File): Promise<string | null> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = async () => {
                const canvas = document.createElement("canvas");
                const MAX_WIDTH = 800;
                const MAX_HEIGHT = 800;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");

                if (!ctx) {
                    reject(new Error("Could not get canvas context"));
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(async (blob) => {
                    if (!blob) {
                        reject(new Error("Canvas to Blob failed"));
                        return;
                    }

                    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;

                    const { data, error } = await supabase.storage
                        .from("perfumes")
                        .upload(fileName, blob, {
                            contentType: "image/webp",
                            cacheControl: "3600",
                            upsert: false
                        });

                    if (error) {
                        console.error("Storage upload error:", error);
                        reject(error);
                        return;
                    }

                    const { data: publicUrlData } = supabase.storage.from("perfumes").getPublicUrl(fileName);
                    resolve(publicUrlData.publicUrl);
                }, "image/webp", 0.8);
            };
            img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
    });
};
