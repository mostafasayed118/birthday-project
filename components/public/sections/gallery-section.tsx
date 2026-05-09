"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { SectionProps, GalleryContent } from "@/lib/types";
import { Reveal, MatIcon } from "../shared-primitives";

const GALLERY_CONFIGS = [
  { className: "col-span-2 sm:col-span-3 row-span-2", delay: "delay-100" },
  { className: "col-span-1 row-span-2", delay: "delay-200" },
  { className: "col-span-1 row-span-1", delay: "delay-300" },
  { className: "col-span-1 row-span-1", delay: "delay-400" },
  { className: "col-span-2 sm:col-span-3 row-span-1", delay: "delay-100" },
];

function GalleryImageLoader({ img, cfg }: { img: import("@/lib/types").GalleryImage, cfg: { className: string, delay: string } }) {
  const imageUrl = useQuery(
    api.files.getFileUrl,
    img.storageId ? { storageId: img.storageId } : "skip"
  );
  
  const src = imageUrl ?? img.src ?? img.storageId;

  return (
    <Reveal className={`${cfg.className} overflow-hidden rounded-[2rem] shadow-sm group hover:shadow-2xl transition-all duration-500 relative`} delay={cfg.delay}>
      {src ? (
        <img alt={img.alt || ""} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={src} />
      ) : (
        <div className="w-full h-full bg-primary/10 flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
          <MatIcon name="image" className="text-4xl text-primary/30" decorative />
        </div>
      )}
      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Reveal>
  );
}

export function GallerySection({ content, theme }: SectionProps) {
  const c = content as GalleryContent;
  const images = c.images || [];

  return (
<section className="py-24 md:py-32 px-4 md:px-6 bg-surface relative" id="photo-gallery">
       <div className="max-w-[1200px] mx-auto">
         <Reveal>
           <div className="text-center mb-12 md:mb-20 px-2 sm:px-0">
             <h2 className="font-headline-md text-3xl sm:text-4xl md:text-5xl text-primary font-['Epilogue'] mb-3 md:mb-4">
               {c.heading || "Cherished Moments"}
             </h2>
             {c.subtitle && (
               <p className="font-body-md text-on-surface-variant max-w-2xl mx-auto text-sm sm:text-base">
                 {c.subtitle || "Snapshots of joy, laughter, and everything in between."}
               </p>
             )}
           </div>
         </Reveal>
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[150px] sm:auto-rows-[180px] md:auto-rows-[250px]">
           {images.map((img, i) => {
             const cfg = GALLERY_CONFIGS[i % GALLERY_CONFIGS.length];
             return <GalleryImageLoader key={img.id || i} img={img} cfg={cfg} />;
           })}
           {images.length > 0 && (
             <Reveal className="col-span-2 sm:col-span-3 row-span-1 overflow-hidden rounded-[2rem] shadow-sm group hover:shadow-2xl transition-all duration-500 relative bg-primary-fixed/20 flex items-center justify-center p-4 md:p-8" delay="delay-200">
               <div className="text-center">
                 <MatIcon name="favorite" className="text-3xl sm:text-4xl text-primary mb-2 md:mb-4" decorative />
                 <h3 className="font-headline-sm text-primary font-['Epilogue'] text-sm sm:text-base md:text-lg">More memories<br />to be made today</h3>
               </div>
             </Reveal>
           )}
         </div>
       </div>
     </section>
  );
}
