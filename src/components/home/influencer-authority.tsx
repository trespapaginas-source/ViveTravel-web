import { Instagram, Star, BadgeCheck } from "lucide-react";
import { SafeImage } from "@/components/ui/safe-image";
import { useSiteContent } from "@/lib/use-site-content";

export function InfluencerAuthority() {
  const { content } = useSiteContent();
  const influencer = content.influencer;

  return (
    <section className="py-12 bg-white sm:py-16">
      <div className="container px-4 mx-auto max-w-5xl">
        <div className="bg-gradient-to-br from-ocean/5 to-transparent rounded-3xl border border-ocean/10 overflow-hidden">
          <div className="flex flex-col md:flex-row items-stretch">
            {/* Foto del influencer */}
            <div className="w-full md:w-2/5 aspect-[4/5] md:aspect-auto md:h-auto relative overflow-hidden shrink-0">
              <SafeImage
                src={influencer.imageUrl}
                alt={influencer.name}
                className="w-full h-full object-cover object-top"
              />
              {/* Overlay shadow for mobile text readability if needed */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:hidden"></div>
              <div className="absolute bottom-6 left-6 md:hidden flex flex-col">
                <span className="text-white font-bold text-2xl drop-shadow-md">{influencer.name}</span>
                <span className="text-white/90 text-sm drop-shadow-md flex items-center gap-1.5 mt-1">
                  <BadgeCheck className="w-4 h-4 text-sky-400 fill-sky-400" />
                  {influencer.role}
                </span>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center flex-1">
              <div className="hidden md:flex items-center gap-2 mb-4">
                <span className="bg-ocean/10 text-ocean text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full">
                  {influencer.role}
                </span>
                <BadgeCheck className="w-6 h-6 text-sky-500 fill-sky-500" />
              </div>

              <h2 className="hidden md:block text-3xl md:text-4xl font-bold text-foreground mb-4">
                {influencer.name}
              </h2>

              <p className="text-lg md:text-xl text-muted-foreground italic mb-8 leading-relaxed relative">
                <span className="text-5xl text-ocean/20 absolute -top-4 -left-4 font-serif">"</span>
                {influencer.quote}
                <span className="text-5xl text-ocean/20 absolute -bottom-6 ml-2 font-serif">"</span>
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-auto">
                <a 
                  href={influencer.instagramUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-medium py-3 px-8 rounded-full hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-0.5 w-full sm:w-auto"
                >
                  <Instagram className="w-5 h-5" />
                  <span>{influencer.instagramLabel}</span>
                </a>
                <div className="flex items-center justify-center gap-2 text-sm text-slate-600 font-medium bg-slate-100 py-3 px-6 rounded-full w-full sm:w-auto">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>{influencer.statsLabel}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
