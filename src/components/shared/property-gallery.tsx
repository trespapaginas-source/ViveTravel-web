"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PropertyGalleryProps {
  images: string[];
  title?: string;
  className?: string;
  variant?: "default" | "cabin" | "booking";
}

// ─── Desktop Gallery: Booking.com style ────────────────────────────────────────
// 2 columns: Left ~60% (1 large image full height) + Right ~40% (2 stacked images)
// "+N fotos" overlay on the bottom-right image

function DesktopGallery({
  images,
  onImageClick,
}: {
  images: string[];
  onImageClick: (index: number) => void;
}) {
  const count = images.length;
  // Calculate how many extra photos exist beyond the 3 visible ones
  const extraCount = count > 3 ? count - 3 : 0;

  if (count === 1) {
    return (
      <div
        className="relative aspect-[16/9] rounded-2xl overflow-hidden cursor-pointer group"
        onClick={() => onImageClick(0)}
      >
        <GalleryImage src={images[0]} alt="Imagen 1" priority />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>
    );
  }

  if (count === 2) {
    return (
      <div className="flex gap-2 rounded-2xl overflow-hidden h-[460px]">
        {/* Left large image */}
        <div
          className="relative flex-[3] cursor-pointer group overflow-hidden"
          onClick={() => onImageClick(0)}
        >
          <GalleryImage src={images[0]} alt="Imagen 1" priority />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>
        {/* Right image */}
        <div
          className="relative flex-[2] cursor-pointer group overflow-hidden"
          onClick={() => onImageClick(1)}
        >
          <GalleryImage src={images[1]} alt="Imagen 2" priority />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>
      </div>
    );
  }

  // 3+ images: Airbnb layout — 1 large left (~60%), 2x2 grid right, 5 thumbnails bottom
  return <BookingDesktopGallery images={images} onImageClick={onImageClick} />;
}

// ─── Desktop Gallery: Cabin style (Booking.com Exact) ──────────────────────
function CabinDesktopGallery({
  images,
  onImageClick,
}: {
  images: string[];
  onImageClick: (index: number) => void;
}) {
  const count = images.length;
  const extraCount = count > 3 ? count - 3 : 0;

  if (count === 1) {
    return (
      <div
        className="relative h-[420px] lg:h-[480px] w-full rounded-[16px] overflow-hidden cursor-pointer group"
        onClick={() => onImageClick(0)}
      >
        <GalleryImage src={images[0]} alt="Imagen 1" priority />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>
    );
  }

  if (count === 2) {
    return (
      <div 
        className="grid gap-[8px] h-[420px] lg:h-[480px] w-full rounded-[16px] overflow-hidden"
        style={{ gridTemplateColumns: "2fr 1.35fr" }}
      >
        {/* Left: Main large image */}
        <div
          className="relative cursor-pointer group overflow-hidden"
          onClick={() => onImageClick(0)}
        >
          <GalleryImage src={images[0]} alt="Imagen 1" priority />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>
        {/* Right image */}
        <div
          className="relative cursor-pointer group overflow-hidden"
          onClick={() => onImageClick(1)}
        >
          <GalleryImage src={images[1]} alt="Imagen 2" priority />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>
      </div>
    );
  }

  return (
    <div 
      className="grid gap-[8px] h-[420px] lg:h-[480px] w-full rounded-[16px] overflow-hidden"
      style={{ gridTemplateColumns: "2fr 1.35fr", gridTemplateRows: "1fr 1fr" }}
    >
      {/* Left: Main large image spanning 2 rows */}
      <div
        className="relative cursor-pointer group overflow-hidden"
        style={{ gridRow: "1 / span 2" }}
        onClick={() => onImageClick(0)}
      >
        <GalleryImage src={images[0]} alt="Imagen 1" priority />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      {/* Right Top */}
      <div
        className="relative cursor-pointer group overflow-hidden"
        onClick={() => onImageClick(1)}
      >
        <GalleryImage src={images[1]} alt="Imagen 2" priority />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      {/* Right Bottom */}
      <div
        className="relative cursor-pointer group overflow-hidden"
        onClick={() => onImageClick(2)}
      >
        <GalleryImage src={images[2]} alt="Imagen 3" priority={false} />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        {extraCount > 0 && <MorePhotosOverlay count={extraCount} />}
      </div>
    </div>
  );
}

// ─── Desktop Gallery: Airbnb Style ──────────────────────────────────────────
// 1 Main focal image on left (~60% width) + 2x2 grid of 4 photos on right
// Bottom: Row of 5 thumbnails with "+N fotos" overlay on the 5th thumbnail

function BookingDesktopGallery({
  images,
  onImageClick,
}: {
  images: string[];
  onImageClick: (index: number) => void;
}) {
  const count = images.length;
  const mainImage = images[0];

  // Images for right 2x2 grid (index 1, 2, 3, 4)
  const rightGridImages = Array.from({ length: 4 }).map((_, idx) => {
    const targetIdx = idx + 1;
    return images[targetIdx] || images[targetIdx % count] || mainImage;
  });

  // Images for 5 bottom thumbnails (index 3, 4, 5, 6, 7 or wrapped)
  const thumbnailStartIndex = 3;
  const extraCount = count > 8 ? count - 8 : 0;

  return (
    <div className="w-full">
      {/* Top Grid: Main image (left 60%, 620:508 ratio) + 2x2 Grid (right 40%) */}
      <div 
        className="grid grid-cols-12 gap-2 w-full rounded-2xl overflow-hidden"
      >
        {/* Left: Main focal image (60% width, 7 cols, 620:508 proportion) */}
        <div
          className="col-span-7 relative aspect-[620/508] cursor-pointer group overflow-hidden"
          onClick={() => onImageClick(0)}
        >
          <GalleryImage src={mainImage} alt="Foto principal" priority />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>

        {/* Right: 2x2 Grid of 4 square photos (5 cols) matching height */}
        <div className="col-span-5 grid grid-cols-2 grid-rows-2 gap-2 h-full">
          {rightGridImages.map((img, idx) => {
            const realIndex = (idx + 1) < count ? idx + 1 : idx % count;
            return (
              <div
                key={idx}
                className="relative h-full w-full cursor-pointer group overflow-hidden"
                onClick={() => onImageClick(realIndex)}
              >
                <GalleryImage src={img} alt={`Foto ${idx + 2}`} priority={idx < 2} />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Row: 5 thumbnail images matching the SAME 620:508 proportion */}
      <div className="grid grid-cols-5 gap-2 mt-2 w-full">
        {Array.from({ length: 5 }).map((_, idx) => {
          const targetIndex = (thumbnailStartIndex + idx) % count;
          const img = images[targetIndex] || mainImage;
          const isLast = idx === 4;
          const showOverlay = isLast && extraCount > 0;

          return (
            <div
              key={idx}
              className="relative aspect-[620/508] cursor-pointer group overflow-hidden rounded-xl w-full"
              onClick={() => onImageClick(targetIndex)}
            >
              <GalleryImage src={img} alt={`Miniatura ${idx + 1}`} priority={false} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              {showOverlay && <MorePhotosOverlay count={extraCount} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Mobile Gallery: 2x2 grid, 4:3 aspect ─────────────────────────────────────

function MobileGallery({
  images,
  onImageClick,
}: {
  images: string[];
  onImageClick: (index: number) => void;
}) {
  const displayImages = images.slice(0, 4);
  const extraCount = images.length > 4 ? images.length - 4 : 0;

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-1.5 rounded-xl overflow-hidden max-w-full">
      {displayImages.map((img, i) => (
        <div
          key={i}
          className="relative cursor-pointer group overflow-hidden aspect-[4/3]"
          onClick={() => onImageClick(i)}
        >
          <GalleryImage src={img} alt={`Imagen ${i + 1}`} priority={i < 2} />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
          {/* "+N fotos" overlay on last visible image */}
          {i === 3 && extraCount > 0 && (
            <MorePhotosOverlay count={extraCount} />
          )}
        </div>
      ))}
      {/* Fill empty cells if less than 4 images */}
      {displayImages.length < 4 &&
        Array.from({ length: 4 - displayImages.length }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="bg-muted/30 aspect-[4/3]" />
        ))}
    </div>
  );
}

// ─── Optimized Gallery Image ───────────────────────────────────────────────────

function GalleryImage({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <img       src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      sizes="(max-width: 640px) 48vw, (max-width: 1024px) 60vw, 720px"
      className="w-full h-full object-cover transition-transform duration-300"
     onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80"; e.currentTarget.onerror = null; }} />
  );
}

// ─── "+N fotos" Overlay ────────────────────────────────────────────────────────

function MorePhotosOverlay({ count }: { count: number }) {
  return (
    <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px] flex flex-col items-center justify-center transition-all duration-300 group-hover:bg-black/65">
      <span className="text-white font-bold text-lg tracking-wide">
        +{count} fotos
      </span>
      <span className="text-white/80 text-xs font-semibold mt-1">
        Ver todas
      </span>
    </div>
  );
}

// ─── Full-Screen Lightbox ──────────────────────────────────────────────────────

function Lightbox({
  images,
  initialIndex,
  onClose,
  title,
}: {
  images: string[];
  initialIndex: number;
  onClose: () => void;
  title?: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      }
      if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [images.length, onClose]);

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex(((index % images.length) + images.length) % images.length);
    },
    [images.length]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] bg-black/95 flex flex-col overflow-y-auto"
    >
      {/* Header */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 py-4 shrink-0 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="min-w-0">
          {title && (
            <p className="text-white/80 text-sm font-medium truncate max-w-[50vw]">
              {title}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white/60 text-sm tabular-nums">
            {currentIndex + 1} / {images.length}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-white/10 rounded-full h-9 w-9"
            aria-label="Cerrar galería"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Image Area */}
      <div className="flex-1 relative flex items-center justify-center px-4 sm:px-12 pb-4 min-h-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`Imagen ${currentIndex + 1}`}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.5}
            onDragEnd={(_e, info) => {
              const swipe = info.offset.x;
              const swipeThreshold = 50;
              if (swipe < -swipeThreshold) {
                goTo(currentIndex + 1);
              } else if (swipe > swipeThreshold) {
                goTo(currentIndex - 1);
              }
            }}
            className="max-w-full max-h-full object-contain rounded-lg touch-none cursor-grab active:cursor-grabbing" />
        </AnimatePresence>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full h-10 w-10 sm:h-12 sm:w-12 backdrop-blur-sm"
              onClick={() => goTo(currentIndex - 1)}
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full h-10 w-10 sm:h-12 sm:w-12 backdrop-blur-sm"
              onClick={() => goTo(currentIndex + 1)}
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="shrink-0 px-4 pb-4 sm:pb-6">
          <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar max-w-4xl mx-auto">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={cn(
                  "w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all duration-200",
                  currentIndex === i
                    ? "border-white scale-105 shadow-lg"
                    : "border-transparent opacity-40 hover:opacity-70"
                )}
              >
                <img                   src={img}
                  alt={`Miniatura ${i + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                 onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80"; e.currentTarget.onerror = null; }} />
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ─── Main Export ───────────────────────────────────────────────────────────────

export function PropertyGallery({ images, title, className, variant = "default" }: PropertyGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleImageClick = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const handleCloseLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  // Fill with example images if variant is "booking"
  let galleryImages = images;
  if (variant === "booking") {
    const defaultExamples = [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&h=600&fit=crop&q=80",
      "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&h=600&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&h=600&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop&q=80",
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop&q=80",
      "https://images.unsplash.com/photo-1470233572422-67b28243076a?w=800&h=600&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&h=600&fit=crop&q=80",
      "https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?w=800&h=600&fit=crop&q=80"
    ];
    const filled = [...images];
    
    // Fill until we have at least 10 images to ensure visibleImages gets 8 and extraCount has remaining
    let idx = 0;
    while (filled.length < 10) {
      const fallback = defaultExamples[idx % defaultExamples.length];
      if (!filled.includes(fallback)) {
        filled.push(fallback);
      } else {
        filled.push(fallback + `&sig=${filled.length}`);
      }
      idx++;
    }
    
    galleryImages = filled;
  }

  return (
    <div className={cn("relative", className)}>
      {/* Desktop Gallery */}
      <div className="hidden sm:block">
        {variant === "cabin" ? (
          <CabinDesktopGallery images={galleryImages} onImageClick={handleImageClick} />
        ) : variant === "booking" ? (
          <BookingDesktopGallery images={galleryImages} onImageClick={handleImageClick} />
        ) : (
          <DesktopGallery images={galleryImages} onImageClick={handleImageClick} />
        )}
      </div>

      {/* Mobile Gallery */}
      <div className="sm:hidden">
        <MobileGallery images={images} onImageClick={handleImageClick} />
      </div>

      {/* Lightbox — key forces remount when clicking a different starting image */}
      {lightboxOpen && (
        <Lightbox
          key={lightboxIndex}
          images={galleryImages}
          initialIndex={lightboxIndex}
          onClose={handleCloseLightbox}
          title={title} />
      )}
    </div>
  );
}

