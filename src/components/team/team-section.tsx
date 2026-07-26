"use client";

import { Code2, Star, TrendingUp, Heart, Users, Globe, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigation } from "@/lib/store";
import { useSiteContent } from "@/lib/use-site-content";

const teamMembers = [
  {
    name: "Andrés Trespalacios",
    role: "Creador Digital & Estratega",
    description:
      "Creador de la plataforma digital y arquitectura de Vive Travel. Su visión digital optimizó la experiencia del viajero y la estructura operativa de la agencia.",
    initials: "AT",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    icon: Code2,
  },
  {
    name: "Luis Méndez",
    role: "Influencer & Accionista Mayoritario",
    description:
      "Rostro e imagen de la agencia. Conecta directamente a la comunidad con los mejores destinos del Atlántico y el Caribe a través de su alcance digital.",
    initials: "LM",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    icon: Star,
    featured: true,
  },
  {
    name: "Jean Fontalo",
    role: "Operaciones & Ventas Comerciales",
    description:
      "Líder operativo y comercial. Se encarga de la logística impecable de cada salida, garantizando el cumplimiento de los estándares de servicio.",
    initials: "JF",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
    icon: TrendingUp,
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
  const teamConfig = content.team || {
    title: "Nuestro Equipo de Trabajo",
    subtitle: "Conoce a las personas apasionadas detrás de cada viaje y experiencia en Vive Travel.",
    description: "Combinamos visión digital, alcance en redes y excelencia operativa para ofrecer el mejor servicio de turismo en la región Caribe.",
  };

  return (
    <div className="bg-slate-50/70 min-h-screen pt-24 sm:pt-28 pb-10 sm:pb-14 text-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            Equipo Humano
          </span>
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight leading-snug">
            {teamConfig.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
            {teamConfig.subtitle}
          </p>
        </div>

        {/* Intro Story */}
        <div className="max-w-3xl mx-auto text-center border-b border-slate-200/80 pb-8">
          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
            {teamConfig.description}
          </p>
        </div>

        {/* Team Members Grid (3 cols) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-2xs text-center space-y-4 hover:border-slate-300 transition-colors"
            >
              {/* Avatar Circle */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border border-slate-200 shadow-2xs mx-auto bg-slate-100 flex items-center justify-center">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover select-none"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const parent = e.currentTarget.parentElement;
                      if (parent && !parent.querySelector(".initials-fallback")) {
                        const fallback = document.createElement("span");
                        fallback.className = "initials-fallback text-xl font-semibold text-slate-700 select-none";
                        fallback.innerText = member.initials;
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                ) : (
                  <span className="text-xl font-semibold text-slate-700 select-none">
                    {member.initials}
                  </span>
                )}
              </div>

              {/* Name & Role */}
              <div className="space-y-1">
                {member.featured && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60 mb-1">
                    <Star className="w-3 h-3 text-emerald-600" />
                    Vocero Principal
                  </span>
                )}
                <h3 className="text-lg font-semibold text-slate-900 tracking-tight">
                  {member.name}
                </h3>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {member.role}
                </p>
              </div>

              {/* Bio Description */}
              <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                {member.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <section className="py-8 border-y border-slate-200/80">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
              Cifras de Nuestra Cobertura
            </h2>
            <p className="text-xs text-slate-500 font-normal">
              Resultados obtenidos a través de la excelencia operativa y servicio al cliente
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {stats.map((stat) => (
              <div key={stat.label} className="space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-slate-400 mb-1">
                  <stat.icon className="w-4 h-4" />
                </div>
                <p className="text-2xl sm:text-3xl font-semibold text-slate-900">
                  {stat.value}
                </p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <div className="text-center space-y-4 max-w-xl mx-auto pt-2">
          <h3 className="text-base font-semibold text-slate-900">
            ¿Listo para conocer nuestras experiencias turísticas?
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              onClick={() => navigate("plans")}
              className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer w-full sm:w-auto"
            >
              <span>Ver catálogo de planes</span>
              <ArrowRight className="w-3.5 h-3.5 ml-2" />
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("contact")}
              className="border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl px-6 py-2.5 text-xs font-semibold transition-colors cursor-pointer w-full sm:w-auto"
            >
              <span>Contactar a un asesor</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
