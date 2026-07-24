"use client";

import Link from "next/link";
import { useNavigation } from "@/lib/store";
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  MessageCircle,
  ArrowUpRight,
} from "lucide-react";
import { useSiteContent } from "@/lib/use-site-content";

export function Footer() {
  const { navigate, currentView } = useNavigation();
  const { content } = useSiteContent();
  const f = content.footer;

  if (currentView === "plan-detail" || currentView === "cabin-detail") return null;

  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0B1120] text-white mt-auto border-t border-white/5">
      {/* Top band — brand + CTA */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-16 items-start">
            {/* Brand block */}
            <div>
              <img
                src="/logos/vive-travel-white.png"
                alt={f.brandName}
                className="h-11 w-auto mb-5"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80";
                  e.currentTarget.onerror = null;
                }}
              />
              <p className="text-[15px] text-zinc-400 leading-relaxed max-w-md">
                {f.description}
              </p>

              {/* Social */}
              <div className="flex items-center gap-3 mt-6">
                {[
                  { icon: Instagram, href: f.instagramUrl, label: "Instagram" },
                  { icon: Facebook, href: f.facebookUrl, label: "Facebook" },
                  { icon: MessageCircle, href: f.whatsappUrl, label: "WhatsApp" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-200"
                    aria-label={social.label}
                    target={
                      social.href.startsWith("http") || social.href.startsWith("https")
                        ? "_blank"
                        : undefined
                    }
                    rel={
                      social.href.startsWith("http") || social.href.startsWith("https")
                        ? "noopener noreferrer"
                        : undefined
                    }
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* WhatsApp CTA card */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ocean-light mb-2">
                {f.helpTitle}
              </p>
              <p className="text-[15px] text-zinc-300 leading-relaxed mb-5">
                {f.helpDescription}
              </p>
              <a
                href={f.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full h-11 rounded-full bg-white text-[#0B1120] text-sm font-semibold hover:bg-zinc-100 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                {f.chatButton}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main link columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Explorar */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500 mb-4">
              Explorar
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: "Experiencias y viajes", href: "/planes" },
                { label: "Cabañas", href: "/cabanas" },
                { label: "Transporte", href: "/transporte" },
                { label: "Nuestro equipo", view: "team" as const },
              ].map((item) =>
                item.href ? (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-[14px] text-zinc-400 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ) : (
                  <li key={item.label}>
                    <button
                      onClick={() => navigate(item.view!)}
                      className="text-[14px] text-zinc-400 hover:text-white transition-colors"
                    >
                      {item.label}
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Soporte */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500 mb-4">
              Soporte
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: "Contacto", view: "contact" as const },
                { label: "PQR y sugerencias", href: "/politicas/pqr" },
                { label: "Manual del viajero", href: "/politicas/manual-viajero" },
              ].map((item) =>
                item.href ? (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-[14px] text-zinc-400 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ) : (
                  <li key={item.label}>
                    <button
                      onClick={() => navigate(item.view!)}
                      className="text-[14px] text-zinc-400 hover:text-white transition-colors"
                    >
                      {item.label}
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500 mb-4">
              Legal
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: "Términos y condiciones", href: "/politicas/terminos" },
                { label: "Política de privacidad", href: "/politicas/privacidad" },
                { label: "Tratamiento de datos", href: "/politicas/datos" },
                { label: "Política de cookies", href: "/politicas/cookies" },
                { label: "Reservas y cancelaciones", href: "/politicas/reservas" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-[14px] text-zinc-400 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500 mb-4">
              Contacto
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${f.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2.5 text-[14px] text-zinc-400 hover:text-white transition-colors group"
                >
                  <Phone className="w-4 h-4 text-zinc-500 group-hover:text-ocean-light shrink-0 transition-colors" />
                  <span>{f.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${f.email}`}
                  className="flex items-center gap-2.5 text-[14px] text-zinc-400 hover:text-white transition-colors group"
                >
                  <Mail className="w-4 h-4 text-zinc-500 group-hover:text-ocean-light shrink-0 transition-colors" />
                  <span className="break-all">{f.email}</span>
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-[14px] text-zinc-400">
                <MapPin className="w-4 h-4 text-zinc-500 mt-0.5 shrink-0" />
                <span>{f.location}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Subfooter — corporate identity + trust */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            {/* Corporate data */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-zinc-500">
              <span className="font-medium text-zinc-400">{f.copyright.replace("{year}", String(year))}</span>
              <span className="hidden sm:inline text-zinc-700">·</span>
              <span>Vive Group S.A.S.</span>
              <span className="hidden sm:inline text-zinc-700">·</span>
              <span>NIT 901993710</span>
              <span className="hidden sm:inline text-zinc-700">·</span>
              <span>RNT 278488</span>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center gap-4">
              {/* RNT badge */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-[11px] font-medium text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                RNT 278488
              </span>
              {/* Legal hub link */}
              <Link
                href="/politicas"
                className="inline-flex items-center gap-1 text-[12px] text-zinc-400 hover:text-white transition-colors"
              >
                Documentos legales
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Made with */}
          <p className="text-[12px] text-zinc-600 mt-4 text-center lg:text-left">
            {f.madeWith}
          </p>
        </div>
      </div>
    </footer>
  );
}
