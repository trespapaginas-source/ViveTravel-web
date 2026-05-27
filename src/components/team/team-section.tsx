"use client";

import { Code2, Star, TrendingUp, Heart, Users, Globe, Sparkles, ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { useNavigation } from "@/lib/store";
import { useSiteContent } from "@/lib/use-site-content";

const teamMembers = [
  {
    name: "Andrés Trespalacios",
    role: "Creador Digital & Estratega",
    description:
      "Creador de la página web y CRM de la agencia. Aportador de ideas clave que ayudaron a estructurar la agencia de la manera correcta. Su visión digital transformó la forma en que Vive Travel conecta con sus viajeros.",
    initials: "AT",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    icon: Code2,
    accent: "ocean" as const,
    accentBg: "bg-ocean",
    accentLight: "bg-ocean/10",
    accentText: "text-ocean",
    accentBorder: "border-ocean/20",
  },
  {
    name: "Luis Méndez",
    role: "Influencer & Accionista Mayoritario",
    description:
      "El rostro e imagen de la agencia. Como influencer y accionista mayoritario, Luis es la conexión directa entre Vive Travel y la comunidad de viajeros. Su carisma y alcance inspiran a miles a descubrir el Atlántico.",
    initials: "LM",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    icon: Star,
    accent: "ocean" as const,
    accentBg: "bg-ocean",
    accentLight: "bg-ocean/10",
    accentText: "text-ocean",
    accentBorder: "border-ocean/20",
    featured: true,
  },
  {
    name: "Jean Fontalo",
    role: "Operaciones & Ventas Comerciales",
    description:
      "El motor operativo y comercial de la agencia. Jean se encarga de que cada experiencia sea impecable, desde la logística hasta la atención al viajero. Su dedicación garantiza la calidad en cada viaje.",
    initials: "JF",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
    icon: TrendingUp,
    accent: "ocean" as const,
    accentBg: "bg-ocean",
    accentLight: "bg-ocean/10",
    accentText: "text-ocean",
    accentBorder: "border-ocean/20",
  },
];

const stats = [
  { value: "3", label: "Fundadores", icon: Users },
  { value: "50+", label: "Experiencias", icon: Globe },
  { value: "15+", label: "Destinos", icon: Heart },
  { value: "100%", label: "Pasión Caribeña", icon: Sparkles },
];

export function TeamSection() {
  const { navigate } = useNavigation();
  const { content } = useSiteContent();
  const teamConfig = content.team;

  return (
    <section className="py-16 sm:py-20 lg:py-28 relative overflow-hidden content-visibility-auto contain-intrinsic-size-auto">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-ocean/[0.02] to-background" />
      <div className="absolute top-40 -left-32 w-96 h-96 bg-ocean/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -right-32 w-80 h-80 bg-mint/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-leaf/3 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header — CSS animation */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <SectionHeader
            title={teamConfig.title}
            subtitle={teamConfig.subtitle} />
        </div>

        {/* Story intro — CSS animation with delay */}
        <div
          className="max-w-3xl mx-auto text-center mb-12 sm:mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500"
          style={{ animationDelay: "100ms", animationFillMode: "both" }}
        >
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            {teamConfig.description}
          </p>
          {/* Decorative line */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="w-12 h-0.5 bg-ocean/30 rounded-full" />
            <div className="w-3 h-3 rounded-full bg-ocean/20" />
            <div className="w-12 h-0.5 bg-ocean/30 rounded-full" />
          </div>
        </div>

        {/* Team Cards — CSS stagger animation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-16 sm:mb-20">
          {teamMembers.map((member, index) => (
            <div
              key={member.name}
              className="group relative animate-in fade-in slide-in-from-bottom-6 duration-500"
              style={{ animationDelay: `${index * 150}ms`, animationFillMode: "both" }}
            >
              <div
                className={`relative bg-card rounded-2xl border border-border/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-ocean/5 hover:-translate-y-1 ${
                  member.featured ? "ring-2 ring-ocean/25" : ""
                }`}
              >
                {/* Top accent bar */}
                <div className={`h-1.5 ${member.accentBg}`} />

                {/* Featured badge */}
                {member.featured && (
                  <div className="absolute top-5 right-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-ocean/10 text-ocean text-[10px] font-bold uppercase tracking-wider">
                      <Star className="w-3 h-3 fill-current" />
                      Rostro de la agencia
                    </span>
                  </div>
                )}

                <div className="p-6 sm:p-8 text-center">
                  {/* Avatar */}
                  <div className="relative mx-auto mb-6 w-28 h-28 sm:w-32 sm:h-32">
                    {/* Decorative ring */}
                    <div
                      className={`absolute inset-0 rounded-full ${member.accentLight} scale-110 group-hover:scale-115 transition-transform duration-300`} />
                    <div
                      className={`absolute inset-0 rounded-full border-2 ${member.accentBorder} scale-105`} />
                    {/* Avatar circle */}
                    <div
                      className={`relative w-full h-full rounded-full ${member.accentBg} flex items-center justify-center shadow-lg overflow-hidden`}
                    >
                      {member.image ? (
                        <img 
                          src={member.image} 
                          alt={member.name} 
                          className="w-full h-full object-cover"
                         onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80"; e.currentTarget.onerror = null; }} />
                      ) : (
                        <span className="text-white font-bold text-2xl sm:text-3xl tracking-tight">
                          {member.initials}
                        </span>
                      )}
                    </div>
                    {/* Floating icon — CSS animation with stagger delay */}
                    <div
                      className={`absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-white shadow-md border border-border/50 flex items-center justify-center animate-in fade-in zoom-in-95 duration-300`}
                      style={{ animationDelay: `${400 + index * 150}ms`, animationFillMode: "both" }}
                    >
                      <member.icon className={`w-5 h-5 ${member.accentText}`} />
                    </div>
                  </div>

                  {/* Name & Role */}
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-1.5">
                    {member.name}
                  </h3>
                  <p
                    className={`text-sm font-semibold ${member.accentText} mb-4 tracking-wide uppercase`}
                  >
                    {member.role}
                  </p>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {member.description}
                  </p>

                  {/* Bottom decorative dots */}
                  <div className="mt-6 flex items-center justify-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${member.accentBg} opacity-40`} />
                    <div className={`w-1.5 h-1.5 rounded-full ${member.accentBg} opacity-60`} />
                    <div className={`w-1.5 h-1.5 rounded-full ${member.accentBg} opacity-40`} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section — CSS animation */}
        <div
          className="relative animate-in fade-in slide-in-from-bottom-6 duration-500"
          style={{ animationDelay: "200ms", animationFillMode: "both" }}
        >
          <div className="relative rounded-3xl overflow-hidden bg-gray-50 border border-gray-100">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-ocean rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-80 h-80 bg-mint rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
            </div>

            <div className="relative z-10 py-12 sm:py-16 px-6 sm:px-10">
              <div className="text-center mb-10">
                <h3
                  className="text-2xl sm:text-3xl font-bold text-foreground mb-2 animate-in fade-in slide-in-from-bottom-2 duration-500"
                  style={{ animationDelay: "300ms", animationFillMode: "both" }}
                >
                  Cifras que hablan por nosotros
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
                  Nos hemos encargado de entregar experiencias significativas a cada viajero
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                  <div
                    key={stat.label}
                    className="text-center animate-in fade-in slide-in-from-bottom-2 duration-500"
                    style={{ animationDelay: `${350 + i * 100}ms`, animationFillMode: "both" }}
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-ocean/10 mb-3">
                      <stat.icon className="w-5 h-5 text-ocean" />
                    </div>
                    <p className="text-3xl sm:text-4xl font-bold text-foreground mb-1">
                      {stat.value}
                    </p>
                    <p className="text-muted-foreground text-xs sm:text-sm uppercase tracking-wider font-medium">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA — CSS animation */}
        <div
          className="text-center mt-12 sm:mt-16 animate-in fade-in slide-in-from-bottom-4 duration-500"
          style={{ animationDelay: "400ms", animationFillMode: "both" }}
        >
          <p className="text-muted-foreground mb-6 text-base sm:text-lg">
            Conoce de primera mano lo que podemos hacer por ti
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              onClick={() => navigate("plans", "pasadias")}
              className="bg-ocean hover:bg-ocean-dark text-white px-8 py-5 text-base rounded-xl shadow-lg shadow-ocean/20 transition-all duration-200 hover:scale-105 gap-2"
            >
              Ver experiencias y viajes
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("contact")}
              className="border-ocean/30 text-ocean hover:bg-ocean/5 px-8 py-5 text-base rounded-xl transition-colors duration-200 gap-2"
            >
              Contáctanos
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
