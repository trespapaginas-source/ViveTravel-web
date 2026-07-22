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
import { Card, CardContent } from "@/components/ui/card";

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
  { value: "alojamiento", label: "Alojamiento" },
  { value: "viaje_grupal", label: "Viaje grupal" },
  { value: "viaje_personalizado", label: "Viaje personalizado" },
  { value: "otro", label: "Otro" },
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
    label: "Email",
    value: "info@vivetravel.co",
    href: "mailto:info@vivetravel.co",
  },
  {
    icon: MapPin,
    label: "Ubicación",
    value: "Barranquilla, Atlántico, Colombia",
    href: null,
  },
  {
    icon: Clock,
    label: "Horario",
    value: "Lun - Sáb: 8:00 AM - 6:00 PM\nDom: 9:00 AM - 1:00 PM",
    href: null,
  },
];

const inputClass =
  "h-11 sm:h-12 rounded-xl border-[#E5E7EB] text-[#1F2937] focus-visible:border-ocean/60 focus-visible:ring-ocean/15";

export function ContactSection() {
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
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    toast.success("Mensaje enviado", {
      description: "Te contactaremos pronto. ¡Gracias por escribirnos!",
    });
    form.reset();
  }

  return (
    <section className="relative bg-white py-10 sm:py-12 lg:py-14 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <span className="inline-flex items-center gap-1.5 text-[#6B7280] text-xs font-medium tracking-wider uppercase mb-3">
            <MessageCircle className="w-3.5 h-3.5" />
            CONTÁCTANOS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111827] mb-3">
            ¿Listo para tu próxima aventura?
          </h2>
          <p className="text-[#374151] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Estamos aquí para ayudarte a planear el viaje perfecto. Escríbenos y
            te responderemos lo antes posible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(320px,2fr)] gap-6 lg:gap-8 items-start">
          <Card className="border-[#E5E7EB] bg-white shadow-[0_12px_36px_rgba(17,24,39,0.06)] rounded-[22px]">
            <CardContent className="p-5 sm:p-7 lg:p-8">
              <h3 className="text-xl font-bold text-[#111827] mb-5 flex items-center gap-2">
                <Send className="w-5 h-5 text-ocean" />
                Envíanos un mensaje
              </h3>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-[#111827]">
                            Nombre completo <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Tu nombre"
                              className={inputClass}
                              {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-[#111827]">
                            Correo electrónico <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="tu@email.com"
                              className={inputClass}
                              {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-[#111827]">
                            Teléfono <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="+57 300 123 4567"
                              className={inputClass}
                              {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-[#111827]">
                            Asunto <span className="text-destructive">*</span>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full h-11 sm:h-12 rounded-xl border-[#E5E7EB] text-[#1F2937] focus:border-ocean/60 focus:ring-ocean/15">
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
                      )} />
                  </div>

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-[#111827]">
                          Mensaje <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Cuéntanos sobre el viaje que tienes en mente..."
                            className="min-h-[120px] sm:min-h-[132px] resize-y rounded-xl border-[#E5E7EB] text-[#1F2937] focus-visible:border-ocean/60 focus-visible:ring-ocean/15"
                            {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                  <FormField
                    control={form.control}
                    name="contactMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-[#111827]">
                          Método de contacto preferido
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-wrap gap-2.5"
                          >
                            <div className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-[#E5E7EB] cursor-pointer has-[data-state=checked]:bg-ocean/10 has-[data-state=checked]:border-ocean/40">
                              <RadioGroupItem value="whatsapp" id="whatsapp" />
                              <label
                                htmlFor="whatsapp"
                                className="text-sm font-semibold text-[#1F2937] cursor-pointer flex items-center gap-1.5"
                              >
                                <MessageCircle className="w-4 h-4 text-ocean" />
                                WhatsApp
                              </label>
                            </div>
                            <div className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-[#E5E7EB] cursor-pointer has-[data-state=checked]:bg-ocean/10 has-[data-state=checked]:border-ocean/40">
                              <RadioGroupItem value="email" id="email" />
                              <label
                                htmlFor="email"
                                className="text-sm font-semibold text-[#1F2937] cursor-pointer flex items-center gap-1.5"
                              >
                                <Mail className="w-4 h-4 text-ocean" />
                                Email
                              </label>
                            </div>
                            <div className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-[#E5E7EB] cursor-pointer has-[data-state=checked]:bg-ocean/10 has-[data-state=checked]:border-ocean/40">
                              <RadioGroupItem value="phone" id="phone" />
                              <label
                                htmlFor="phone"
                                className="text-sm font-semibold text-[#1F2937] cursor-pointer flex items-center gap-1.5"
                              >
                                <Phone className="w-4 h-4 text-ocean" />
                                Teléfono
                              </label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 w-full sm:w-auto bg-ocean hover:bg-ocean-dark text-white rounded-full px-7 text-sm font-semibold"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Enviar mensaje
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="border-[#E5E7EB] bg-white shadow-[0_12px_36px_rgba(17,24,39,0.05)] rounded-[22px]">
            <CardContent className="p-5 sm:p-6 lg:p-7">
              <h3 className="text-xl font-bold text-[#111827] mb-5">
                Contacto directo
              </h3>

              <div className="divide-y divide-[#E5E7EB]">
                {contactInfo.map((item) => (
                  <div key={item.label} className="py-4 first:pt-0">
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="flex items-start gap-3"
                      >
                        <div className="w-9 h-9 rounded-xl bg-ocean/8 flex items-center justify-center shrink-0">
                          <item.icon className="w-5 h-5 text-ocean" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-[#6B7280] font-medium">
                            {item.label}
                          </p>
                          <p className="text-[#111827] font-semibold text-sm whitespace-pre-line">
                            {item.value}
                          </p>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-ocean/8 flex items-center justify-center shrink-0">
                          <item.icon className="w-5 h-5 text-ocean" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-[#6B7280] font-medium">
                            {item.label}
                          </p>
                          <p className="text-[#111827] font-semibold text-sm whitespace-pre-line">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-5">
                <p className="text-sm font-semibold text-[#111827] mb-3">
                  Síguenos
                </p>
                <div className="flex items-center gap-4">
                  {[
                    { icon: Instagram, href: "#", label: "Instagram" },
                    { icon: Facebook, href: "#", label: "Facebook" },
                    { icon: MessageCircle, href: WHATSAPP_URL, label: "WhatsApp" },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      className="text-[#6B7280] hover:text-ocean"
                      aria-label={social.label}
                      target={social.href.startsWith("http") ? "_blank" : undefined}
                      rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-ocean/15 bg-ocean/[0.04] p-4">
                <h4 className="font-semibold text-[#111827] mb-1 text-sm">
                  ¿Prefieres chatear?
                </h4>
                <p className="text-xs text-[#6B7280] mb-4">
                  Escríbenos por WhatsApp y recibe atención inmediata.
                </p>
                <Button
                  asChild
                  className="h-10 bg-ocean hover:bg-ocean-dark text-white rounded-full px-5 text-sm font-semibold"
                >
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chatear por WhatsApp
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
