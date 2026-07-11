"use client";

import { useNavigation } from "@/lib/store";
import { Mail, Phone, MapPin, Instagram, Facebook, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSiteContent } from "@/lib/use-site-content";

export function Footer() {
  const { navigate, currentView } = useNavigation();
  const { content } = useSiteContent();
  const f = content.footer;

  if (currentView === "plan-detail" || currentView === "cabin-detail") return null;

  return (
    <footer className="bg-[#111827] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Brand */}
          <div className="space-y-4">
            <img               src="/logos/vive-travel-white.png"
              alt={f.brandName}
              className="h-10 w-auto"
              onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80"; e.currentTarget.onerror = null; }} />
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              {f.description}
            </p>
            <div className="flex gap-4">
              {[
                { icon: Instagram, href: f.instagramUrl, label: "Instagram" },
                { icon: Facebook, href: f.facebookUrl, label: "Facebook" },
                { icon: MessageCircle, href: f.whatsappUrl, label: "WhatsApp" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="flex items-center justify-center text-zinc-400 hover:text-white hover:scale-110 transition-all duration-200"
                  aria-label={social.label}
                  target={social.href.startsWith("http") || social.href.startsWith("https") ? "_blank" : undefined}
                  rel={social.href.startsWith("http") || social.href.startsWith("https") ? "noopener noreferrer" : undefined}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[13px] uppercase tracking-wider text-zinc-400">
              {f.exploreTitle}
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Inicio", view: "home" as const },
                { label: "Experiencias y viajes", view: "plans" as const },
                { label: "Cabañas", view: "cabins" as const },
                { label: "Transporte", view: "transports" as const },
                { label: "Nuestro Equipo", view: "team" as const },
                { label: "Contacto", view: "contact" as const },
                { label: "Políticas", view: "policies" as const },
              ].map((item) => (
                <li key={item.view}>
                  <button
                    onClick={() => navigate(item.view, item.view === "plans" ? "pasadias" : null)}
                    className="text-[15px] text-zinc-400 hover:text-white transition-colors py-0.5 flex items-center"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[13px] uppercase tracking-wider text-zinc-400">
              {f.contactTitle}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-[15px] text-zinc-400">
                <Phone className="w-4 h-4 text-zinc-500 shrink-0" />
                <span>{f.phone}</span>
              </li>
              <li className="flex items-center gap-2 text-[15px] text-zinc-400 break-all">
                <Mail className="w-4 h-4 text-zinc-500 shrink-0" />
                <span>{f.email}</span>
              </li>
              <li className="flex items-start gap-2 text-[15px] text-zinc-400">
                <MapPin className="w-4 h-4 text-zinc-500 mt-0.5 shrink-0" />
                <span>{f.location}</span>
              </li>
            </ul>
          </div>

          {/* WhatsApp CTA */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[13px] uppercase tracking-wider text-zinc-400">
              {f.helpTitle}
            </h3>
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              {f.helpDescription}
            </p>
            <Button
              asChild
              className="w-full bg-white/10 hover:bg-white/20 text-white border-0 rounded-full h-11 text-[15px] font-medium"
            >
              <a
                href={f.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {f.chatButton}
              </a>
            </Button>
          </div>
        </div>

        <Separator className="bg-white/10" />

        {/* Bottom Bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-zinc-500 text-center sm:text-left">
            {f.copyright.replace("{year}", new Date().getFullYear().toString())}
          </p>
          <p className="text-[13px] text-zinc-500">
            {f.madeWith}
          </p>
        </div>
      </div>
    </footer>
  );
}
