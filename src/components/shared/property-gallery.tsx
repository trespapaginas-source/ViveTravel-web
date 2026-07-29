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

  // Single-image fallback: show one large hero, no thumbnail row.
  if (count <= 1) {
    return (
      <div
        className="relative h-[380px] lg:h-[440px] w-full rounded-2xl overflow-hidden cursor-pointer group"
        onClick={() => onImageClick(0)}
      >
        <div className="absolute inset-0">
          <GalleryImage src={images[0]} alt="Foto principal" priority />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>
      </div>
    );
  }

  // Top block always uses the first real images (0, 1, 2).
  // For the right column we only render a second tile when a 3rd image exists.
  const mainImage = images[0];
  const rightTopImage = images[1];
  const hasThird = count >= 3;

  // Thumbnails = everything after the top block, capped at 5 visible slots.
  const thumbnailStartIndex = hasThird ? 3 : 2;
  const remaining = Math.max(0, count - thumbnailStartIndex);
  const visibleThumbs = Math.min(remaining, 5);
  // Photos beyond the 5 visible slots are summarised in the "+N" overlay.
  const extraCount = Math.max(0, remaining - 5);

  // When there are >5 remaining, the last slot becomes the "+N" overlay,
  // so it always shows on the 5th thumbnail.
  const showOverlayOnLast = extraCount > 0;
  const thumbCols = showOverlayOnLast ? 5 : Math.max(visibleThumbs, 1);

  return (
    <div className="w-full">
      {/* Top Block: 1 Large Left Image (~62%) + Stacked Right Images (~38%) */}
      <div className="grid grid-cols-12 gap-2 h-[380px] lg:h-[440px] w-full rounded-2xl overflow-hidden">
        {/* Left: Main large focal photo (col-span-7) */}
        <div
          className="col-span-7 relative h-full cursor-pointer group overflow-hidden"
          onClick={() => onImageClick(0)}
        >
          <div className="absolute inset-0">
            <GalleryImage src={mainImage} alt="Foto principal" priority />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>
        </div>

        {/* Right: 1 or 2 stacked photos (col-span-5) */}
        <div
          className={cn(
            "col-span-5 gap-2 h-full",
            hasThird ? "grid grid-rows-2" : "grid grid-rows-1"
          )}
        >
          <div
            className="relative h-full w-full cursor-pointer group overflow-hidden"
            onClick={() => onImageClick(1)}
          >
            <div className="absolute inset-0">
              <GalleryImage src={rightTopImage} alt="Foto 2" priority />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
          </div>

          {hasThird && (
            <div
              className="relative h-full w-full cursor-pointer group overflow-hidden"
              onClick={() => onImageClick(2)}
            >
              <div className="absolute inset-0">
                <GalleryImage src={images[2]} alt="Foto 3" priority={false} />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row: thumbnail strip of remaining real images */}
      {visibleThumbs > 0 && (
        <div
          className="grid gap-2 mt-2 h-[95px] lg:h-[110px] w-full"
          style={{ gridTemplateColumns: `repeat(${thumbCols}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: visibleThumbs }).map((_, idx) => {
            const targetIndex = thumbnailStartIndex + idx;
            const isOverlaySlot = showOverlayOnLast && idx === visibleThumbs - 1;

            return (
              <div
                key={idx}
                className="relative cursor-pointer group overflow-hidden rounded-xl h-full"
                onClick={() => onImageClick(isOverlaySlot ? thumbnailStartIndex : targetIndex)}
              >
                <div className="absolute inset-0">
                  <GalleryImage
                    src={images[targetIndex]}
                    alt={`Miniatura ${idx + 1}`}
                    priority={false}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  {isOverlaySlot && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center transition-all duration-300 group-hover:bg-black/70">
                      <span className="text-white font-bold text-sm sm:text-base tracking-wide underline underline-offset-2">
                        +{extraCount} fotos
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
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

export function Lightbox({
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

  // Use the real plan images directly — never pad with fake stock photos.
  // (Previously this inflated the gallery to 10 images with random Unsplash
  // fallbacks, which produced duplicates and irrelevant beach photos in the
  // lightbox for plans that had fewer than 10 real images.)
  const galleryImages = images;

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

