"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Phone,
  Instagram,
  Facebook,
  Send,
  Loader2,
} from "lucide-react";
import { WHATSAPP_NUMBER, WHATSAPP_URL } from "@/lib/config";
import { useSiteContent } from "@/lib/use-site-content";

function TikTokIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-2.83V7.62a6.34 6.34 0 0 0-5.83 6.32 6.34 6.34 0 0 0 10.74 4.54A6.29 6.29 0 0 0 15.82 14V8.37a8.28 8.28 0 0 0 3.77.92v-2.6z" />
    </svg>
  );
}
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const contactSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Ingresa un correo electrónico válido"),
  phone: z
    .string()
    .min(7, "Ingresa un número de teléfono válido")
    .regex(/^[+]?[\d\s()-]+$/, "Formato de teléfono inválido"),
  subject: z.string().min(1, "Selecciona un asunto"),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
  contactMethod: z.enum(["whatsapp", "email", "phone"], {
    message: "Selecciona un método de contacto",
  }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const subjectOptions = [
  { value: "plan_turistico", label: "Plan turístico" },
  { value: "alojamiento", label: "Alojamiento / Cabañas" },
  { value: "viaje_grupal", label: "Viaje grupal o corporativo" },
  { value: "viaje_personalizado", label: "Viaje a la medida" },
  { value: "otro", label: "Otro motivo" },
];

const contactInfo = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: `+${WHATSAPP_NUMBER.slice(0, 2)} ${WHATSAPP_NUMBER.slice(2, 5)} ${WHATSAPP_NUMBER.slice(5, 8)} ${WHATSAPP_NUMBER.slice(8)}`,
    href: WHATSAPP_URL,
  },
  {
    icon: Mail,
    label: "Correo electrónico",
    value: "comercial@vivetravelcol.co",
    href: "mailto:comercial@vivetravelcol.co",
  },
  {
    icon: MapPin,
    label: "Ubicación principal",
    value: "Barranquilla, Atlántico, Colombia",
    href: null,
  },
  {
    icon: Clock,
    label: "Horario de atención",
    value: "Lun - Sáb: 8:00 AM - 6:00 PM\nDom: 9:00 AM - 1:00 PM",
    href: null,
  },
];

const inputClass =
  "h-11 rounded-xl border-slate-200 text-slate-800 bg-white focus-visible:border-slate-900 focus-visible:ring-1 focus-visible:ring-slate-900/20";

export function ContactSection() {
  const { content } = useSiteContent();
  const c = content.contact;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      contactMethod: "whatsapp",
    },
  });

  async function onSubmit(_data: ContactFormValues) {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSubmitting(false);
    toast.success("Mensaje enviado con éxito", {
      description: "Un asesor de Vive Travel se pondrá en contacto contigo a la brevedad.",
    });
    form.reset();
  }

  return (
    <div className="bg-slate-50/70 min-h-screen pt-24 sm:pt-28 pb-10 sm:pb-14 text-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <MessageCircle className="w-3.5 h-3.5" />
            Contacto Directo
          </span>
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight leading-snug">
            ¿Cómo podemos ayudarte en tu próximo viaje?
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
            Escríbenos para personalizar tu itinerario, reservar tu alojamiento o cotizar transporte corporativo.
          </p>
        </div>

        {/* 2-Column Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-2xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                Envíanos un mensaje
              </h2>
              <p className="text-xs text-slate-500 font-normal">
                Completa tus datos y te responderemos en el menor tiempo posible.
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-slate-700">
                          Nombre completo <span className="text-rose-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Tu nombre y apellido"
                            className={inputClass}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-slate-700">
                          Correo electrónico <span className="text-rose-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="correo@ejemplo.com"
                            className={inputClass}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-slate-700">
                          Teléfono de contacto <span className="text-rose-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+57 300 123 4567"
                            className={inputClass}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-slate-700">
                          Asunto de la consulta <span className="text-rose-500">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full h-11 rounded-xl border-slate-200 text-slate-800 bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900/20">
                              <SelectValue placeholder="Selecciona un asunto" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subjectOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-700">
                        Detalles del mensaje <span className="text-rose-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Escribe aquí las fechas estimadas, número de personas o requerimientos específicos..."
                          className="min-h-[120px] resize-y rounded-xl border-slate-200 text-slate-800 bg-white focus-visible:border-slate-900 focus-visible:ring-1 focus-visible:ring-slate-900/20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-700">
                        Medio preferido de respuesta
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-wrap gap-2 pt-1"
                        >
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 cursor-pointer has-[data-state=checked]:bg-slate-900 has-[data-state=checked]:text-white has-[data-state=checked]:border-slate-900 transition-colors">
                            <RadioGroupItem value="whatsapp" id="whatsapp" className="sr-only" />
                            <label
                              htmlFor="whatsapp"
                              className="text-xs font-medium cursor-pointer flex items-center gap-1.5"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              WhatsApp
                            </label>
                          </div>

                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 cursor-pointer has-[data-state=checked]:bg-slate-900 has-[data-state=checked]:text-white has-[data-state=checked]:border-slate-900 transition-colors">
                            <RadioGroupItem value="email" id="email" className="sr-only" />
                            <label
                              htmlFor="email"
                              className="text-xs font-medium cursor-pointer flex items-center gap-1.5"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              Email
                            </label>
                          </div>

                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 cursor-pointer has-[data-state=checked]:bg-slate-900 has-[data-state=checked]:text-white has-[data-state=checked]:border-slate-900 transition-colors">
                            <RadioGroupItem value="phone" id="phone" className="sr-only" />
                            <label
                              htmlFor="phone"
                              className="text-xs font-medium cursor-pointer flex items-center gap-1.5"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              Llamada
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-7 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        <span>Enviando mensaje...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        <span>Enviar mensaje</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          {/* Right: Direct Channels (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-2xs space-y-5">
              <h3 className="text-base font-semibold text-slate-900 tracking-tight border-b border-slate-100 pb-3">
                Canales de Atención Directa
              </h3>

              <div className="divide-y divide-slate-100">
                {contactInfo.map((item) => (
                  <div key={item.label} className="py-3.5 first:pt-0">
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="group flex items-start gap-3 hover:text-slate-900 transition-colors cursor-pointer"
                      >
                        <item.icon className="w-4 h-4 text-slate-400 group-hover:text-slate-700 shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                            {item.label}
                          </p>
                          <p className="text-slate-800 group-hover:text-slate-900 font-medium text-xs sm:text-sm whitespace-pre-line">
                            {item.value}
                          </p>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-start gap-3">
                        <item.icon className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                            {item.label}
                          </p>
                          <p className="text-slate-800 font-medium text-xs sm:text-sm whitespace-pre-line">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Social Channels */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <p className="text-xs font-medium text-slate-500">
                  Redes sociales oficiales
                </p>
                <div className="flex items-center gap-3">
                  {[
                    { icon: Instagram, href: c.instagramUrl || "https://www.instagram.com/vivetravelcol/", label: "Instagram" },
                    { icon: Facebook, href: c.facebookUrl || "https://www.facebook.com/vivetravelagenciadeturismo/", label: "Facebook" },
                    { icon: TikTokIcon, href: c.tiktokUrl || "https://www.tiktok.com/@vivetravelcol", label: "TikTok" },
                    { icon: MessageCircle, href: c.whatsappUrl || WHATSAPP_URL, label: "WhatsApp" },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                      aria-label={social.label}
                      target={social.href.startsWith("http") ? "_blank" : undefined}
                      rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    >
                      <social.icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Direct WhatsApp Action */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="space-y-1">
                  <h4 className="font-semibold text-xs text-slate-900">
                    Atención Inmediata por WhatsApp
                  </h4>
                  <p className="text-xs text-slate-500 font-normal leading-relaxed">
                    Respuesta rápida para reservas de última hora o consultas de pasadías.
                  </p>
                </div>

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Iniciar chat por WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
