-- ============================================================
-- VIVE TRAVEL - ESQUEMA COMPLETO PARA SUPABASE
-- ============================================================
-- Ejecutar TODO este SQL en el Editor SQL de Supabase
-- (Dashboard → SQL Editor → New Query → Pegar → Run)
-- ============================================================

-- ============================================================
-- 1. TIPOS PERSONALIZADOS
-- ============================================================

CREATE TYPE app_role AS ENUM ('administrador', 'editor');
CREATE TYPE image_source AS ENUM ('external', 'upload');

-- ============================================================
-- 2. TABLA DE PERFILES (extiende auth.users)
-- ============================================================

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role app_role NOT NULL DEFAULT 'editor',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Perfil automático al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'editor')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- RLS: Los usuarios pueden ver su propio perfil
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- RLS: Solo admins pueden ver todos los perfiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'administrador'
    )
  );

-- RLS: Los usuarios pueden actualizar su propio perfil (sin cambiar rol)
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
  );

-- RLS: Solo admins pueden cambiar roles
CREATE POLICY "Admins can update any profile role"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'administrador'
    )
  );

-- ============================================================
-- 3. CATEGORÍAS DE PLANES (tabla de referencia)
-- ============================================================

CREATE TABLE public.plan_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL DEFAULT '#0E7490',
  icon TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed de categorías
INSERT INTO public.plan_categories (name, slug, color, icon, sort_order) VALUES
  ('Naturaleza', 'naturaleza', '#059669', 'Leaf', 1),
  ('Playa', 'playa', '#0E7490', 'Waves', 2),
  ('Aventura', 'aventura', '#F97316', 'Mountain', 3),
  ('Ecoturismo', 'ecoturismo', '#059669', 'Sparkles', 4),
  ('Experiencia', 'experiencia', '#FB7185', 'Star', 5),
  ('Cultural', 'cultural', '#D4A574', 'Landmark', 6);

ALTER TABLE public.plan_categories ENABLE ROW LEVEL SECURITY;

-- Categorías son públicas (lectura para todos)
CREATE POLICY "Categories are publicly readable"
  ON public.plan_categories FOR SELECT
  USING (true);

-- Solo admins/editores pueden modificar categorías
CREATE POLICY "Admins and editors can manage categories"
  ON public.plan_categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('administrador', 'editor')
    )
  );

-- ============================================================
-- 4. PLANES TURÍSTICOS
-- ============================================================

CREATE TABLE public.tour_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL DEFAULT '',
  full_description TEXT NOT NULL DEFAULT '',
  price INT NOT NULL DEFAULT 0,
  price_range TEXT NOT NULL DEFAULT '',
  duration TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  category_id UUID REFERENCES public.plan_categories(id) ON DELETE SET NULL,
  difficulty TEXT NOT NULL DEFAULT 'Fácil',
  schedule TEXT NOT NULL DEFAULT '',
  meeting_point TEXT NOT NULL DEFAULT '',
  rating NUMERIC(2,1) NOT NULL DEFAULT 0,
  review_count INT NOT NULL DEFAULT 0,
  max_guests INT NOT NULL DEFAULT 1,
  published BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_tour_plans_slug ON public.tour_plans(slug);
CREATE INDEX idx_tour_plans_category ON public.tour_plans(category_id);
CREATE INDEX idx_tour_plans_published ON public.tour_plans(published);
CREATE INDEX idx_tour_plans_sort ON public.tour_plans(sort_order);

CREATE TRIGGER tour_plans_updated_at
  BEFORE UPDATE ON public.tour_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.tour_plans ENABLE ROW LEVEL SECURITY;

-- Pública: solo planes publicados
CREATE POLICY "Published plans are publicly readable"
  ON public.tour_plans FOR SELECT
  USING (published = true);

-- Admin/editor: puede ver todos
CREATE POLICY "Admins and editors can see all plans"
  ON public.tour_plans FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('administrador', 'editor')
    )
  );

-- Admin/editor: puede crear
CREATE POLICY "Admins and editors can create plans"
  ON public.tour_plans FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('administrador', 'editor')
    )
  );

-- Admin/editor: puede actualizar
CREATE POLICY "Admins and editors can update plans"
  ON public.tour_plans FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('administrador', 'editor')
    )
  );

-- Solo admin: puede eliminar
CREATE POLICY "Only admins can delete plans"
  ON public.tour_plans FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'administrador'
    )
  );

-- ============================================================
-- 5. IMÁGENES DE PLANES (tabla separada, normalizada)
-- ============================================================

CREATE TABLE public.plan_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES public.tour_plans(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT NOT NULL DEFAULT '',
  storage_path TEXT,
  source image_source NOT NULL DEFAULT 'external',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_plan_images_plan ON public.plan_images(plan_id);
CREATE INDEX idx_plan_images_sort ON public.plan_images(plan_id, sort_order);

ALTER TABLE public.plan_images ENABLE ROW LEVEL SECURITY;

-- Pública: imágenes de planes publicados
CREATE POLICY "Plan images are publicly readable"
  ON public.plan_images FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.tour_plans WHERE id = plan_id AND published = true)
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('administrador', 'editor')
    )
  );

-- Admin/editor: puede gestionar imágenes
CREATE POLICY "Admins and editors can manage plan images"
  ON public.plan_images FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('administrador', 'editor')
    )
  );

-- ============================================================
-- 6. LISTAS DE PLANES (includes, excludes, highlights)
-- ============================================================

CREATE TABLE public.plan_includes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES public.tour_plans(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE public.plan_excludes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES public.tour_plans(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE public.plan_highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES public.tour_plans(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_plan_includes_plan ON public.plan_includes(plan_id, sort_order);
CREATE INDEX idx_plan_excludes_plan ON public.plan_excludes(plan_id, sort_order);
CREATE INDEX idx_plan_highlights_plan ON public.plan_highlights(plan_id, sort_order);

-- RLS para plan_includes
ALTER TABLE public.plan_includes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Plan includes publicly readable"
  ON public.plan_includes FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.tour_plans WHERE id = plan_id AND published = true)
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('administrador', 'editor'))
  );
CREATE POLICY "Admins and editors can manage plan includes"
  ON public.plan_includes FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('administrador', 'editor')));

-- RLS para plan_excludes
ALTER TABLE public.plan_excludes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Plan excludes publicly readable"
  ON public.plan_excludes FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.tour_plans WHERE id = plan_id AND published = true)
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('administrador', 'editor'))
  );
CREATE POLICY "Admins and editors can manage plan excludes"
  ON public.plan_excludes FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('administrador', 'editor')));

-- RLS para plan_highlights
ALTER TABLE public.plan_highlights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Plan highlights publicly readable"
  ON public.plan_highlights FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.tour_plans WHERE id = plan_id AND published = true)
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('administrador', 'editor'))
  );
CREATE POLICY "Admins and editors can manage plan highlights"
  ON public.plan_highlights FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('administrador', 'editor')));

-- ============================================================
-- 7. CABAÑAS
-- ============================================================

CREATE TABLE public.cabins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL DEFAULT '',
  full_description TEXT NOT NULL DEFAULT '',
  price_per_night INT NOT NULL DEFAULT 0,
  price_range TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  capacity INT NOT NULL DEFAULT 2,
  bedrooms INT NOT NULL DEFAULT 1,
  bathrooms INT NOT NULL DEFAULT 1,
  lat NUMERIC(9,6) NOT NULL DEFAULT 0,
  lng NUMERIC(9,6) NOT NULL DEFAULT 0,
  check_in TEXT NOT NULL DEFAULT '3:00 PM',
  check_out TEXT NOT NULL DEFAULT '11:00 AM',
  cancellation_policy TEXT NOT NULL DEFAULT '',
  rating NUMERIC(2,1) NOT NULL DEFAULT 0,
  review_count INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_cabins_slug ON public.cabins(slug);
CREATE INDEX idx_cabins_published ON public.cabins(published);
CREATE INDEX idx_cabins_sort ON public.cabins(sort_order);

CREATE TRIGGER cabins_updated_at
  BEFORE UPDATE ON public.cabins
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.cabins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published cabins are publicly readable"
  ON public.cabins FOR SELECT
  USING (published = true);

CREATE POLICY "Admins and editors can see all cabins"
  ON public.cabins FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('administrador', 'editor')));

CREATE POLICY "Admins and editors can create cabins"
  ON public.cabins FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('administrador', 'editor')));

CREATE POLICY "Admins and editors can update cabins"
  ON public.cabins FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('administrador', 'editor')));

CREATE POLICY "Only admins can delete cabins"
  ON public.cabins FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'administrador'));

-- ============================================================
-- 8. IMÁGENES DE CABAÑAS
-- ============================================================

CREATE TABLE public.cabin_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cabin_id UUID NOT NULL REFERENCES public.cabins(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT NOT NULL DEFAULT '',
  storage_path TEXT,
  source image_source NOT NULL DEFAULT 'external',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_cabin_images_cabin ON public.cabin_images(cabin_id);
CREATE INDEX idx_cabin_images_sort ON public.cabin_images(cabin_id, sort_order);

ALTER TABLE public.cabin_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cabin images are publicly readable"
  ON public.cabin_images FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.cabins WHERE id = cabin_id AND published = true)
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('administrador', 'editor'))
  );

CREATE POLICY "Admins and editors can manage cabin images"
  ON public.cabin_images FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('administrador', 'editor')));

-- ============================================================
-- 9. LISTAS DE CABAÑAS (amenities, highlights, rules)
-- ============================================================

CREATE TABLE public.cabin_amenities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cabin_id UUID NOT NULL REFERENCES public.cabins(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE public.cabin_highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cabin_id UUID NOT NULL REFERENCES public.cabins(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE public.cabin_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cabin_id UUID NOT NULL REFERENCES public.cabins(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_cabin_amenities_cabin ON public.cabin_amenities(cabin_id, sort_order);
CREATE INDEX idx_cabin_highlights_cabin ON public.cabin_highlights(cabin_id, sort_order);
CREATE INDEX idx_cabin_rules_cabin ON public.cabin_rules(cabin_id, sort_order);

-- RLS para cabin_amenities
ALTER TABLE public.cabin_amenities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cabin amenities publicly readable"
  ON public.cabin_amenities FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.cabins WHERE id = cabin_id AND published = true)
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('administrador', 'editor'))
  );
CREATE POLICY "Admins and editors can manage cabin amenities"
  ON public.cabin_amenities FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('administrador', 'editor')));

-- RLS para cabin_highlights
ALTER TABLE public.cabin_highlights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cabin highlights publicly readable"
  ON public.cabin_highlights FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.cabins WHERE id = cabin_id AND published = true)
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('administrador', 'editor'))
  );
CREATE POLICY "Admins and editors can manage cabin highlights"
  ON public.cabin_highlights FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('administrador', 'editor')));

-- RLS para cabin_rules
ALTER TABLE public.cabin_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cabin rules publicly readable"
  ON public.cabin_rules FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.cabins WHERE id = cabin_id AND published = true)
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('administrador', 'editor'))
  );
CREATE POLICY "Admins and editors can manage cabin rules"
  ON public.cabin_rules FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('administrador', 'editor')));

-- ============================================================
-- 10. TESTIMONIOS
-- ============================================================

CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  avatar TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  text TEXT NOT NULL DEFAULT '',
  rating NUMERIC(2,1) NOT NULL DEFAULT 5,
  trip_name TEXT NOT NULL DEFAULT '',
  plan_id UUID REFERENCES public.tour_plans(id) ON DELETE SET NULL,
  published BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_testimonials_published ON public.testimonials(published);
CREATE TRIGGER testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published testimonials are publicly readable"
  ON public.testimonials FOR SELECT
  USING (published = true);

CREATE POLICY "Admins and editors can manage testimonials"
  ON public.testimonials FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('administrador', 'editor')));

-- ============================================================
-- 11. IMÁGENES HERO (carrusel principal)
-- ============================================================

CREATE TABLE public.hero_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  caption TEXT NOT NULL DEFAULT '',
  storage_path TEXT,
  source image_source NOT NULL DEFAULT 'external',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER hero_images_updated_at
  BEFORE UPDATE ON public.hero_images
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.hero_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hero images are publicly readable"
  ON public.hero_images FOR SELECT
  USING (true);

CREATE POLICY "Admins and editors can manage hero images"
  ON public.hero_images FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('administrador', 'editor')));

-- ============================================================
-- 12. IMÁGENES DE VIAJES REALIZADOS
-- ============================================================

CREATE TABLE public.trip_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  caption TEXT NOT NULL DEFAULT '',
  storage_path TEXT,
  source image_source NOT NULL DEFAULT 'external',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trip_images_updated_at
  BEFORE UPDATE ON public.trip_images
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.trip_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trip images are publicly readable"
  ON public.trip_images FOR SELECT
  USING (true);

CREATE POLICY "Admins and editors can manage trip images"
  ON public.trip_images FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('administrador', 'editor')));

-- ============================================================
-- 13. CONTENIDO DEL SITIO (JSONB - editable desde CMS)
-- ============================================================

CREATE TABLE public.site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_site_content_key ON public.site_content(section_key);

CREATE TRIGGER site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site content is publicly readable"
  ON public.site_content FOR SELECT
  USING (true);

CREATE POLICY "Admins and editors can manage site content"
  ON public.site_content FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('administrador', 'editor')));

-- ============================================================
-- 14. MENSAJES DE CONTACTO
-- ============================================================

CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  subject TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  contact_method TEXT NOT NULL DEFAULT 'whatsapp',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_contact_messages_read ON public.contact_messages(is_read);
CREATE INDEX idx_contact_messages_created ON public.contact_messages(created_at DESC);

CREATE TRIGGER contact_messages_updated_at
  BEFORE UPDATE ON public.contact_messages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede crear mensajes (formulario de contacto público)
CREATE POLICY "Anyone can create contact messages"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

-- Solo admins/editores pueden leer mensajes
CREATE POLICY "Admins and editors can read contact messages"
  ON public.contact_messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('administrador', 'editor')));

-- Solo admins/editores pueden actualizar mensajes
CREATE POLICY "Admins and editors can update contact messages"
  ON public.contact_messages FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('administrador', 'editor')));

-- Solo admins pueden eliminar mensajes
CREATE POLICY "Only admins can delete contact messages"
  ON public.contact_messages FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'administrador'));

-- ============================================================
-- 15. CONFIGURACIÓN DE STORAGE
-- ============================================================

-- Crear bucket de imágenes (ejecutar también en Supabase)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Eliminar políticas de Storage si existen para evitar errores al re-ejecutar el script
DROP POLICY IF EXISTS "Images are publicly viewable" ON storage.objects;
DROP POLICY IF EXISTS "Admins and editors can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Admins and editors can update images" ON storage.objects;
DROP POLICY IF EXISTS "Only admins can delete images" ON storage.objects;

-- Políticas de Storage: lectura pública
CREATE POLICY "Images are publicly viewable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

-- Solo admins/editores pueden subir imágenes
CREATE POLICY "Admins and editors can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'images'
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('administrador', 'editor'))
  );

-- Solo admins/editores pueden actualizar imágenes
CREATE POLICY "Admins and editors can update images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'images'
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('administrador', 'editor'))
  );

-- Solo admins pueden eliminar imágenes del storage
CREATE POLICY "Only admins can delete images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'images'
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'administrador')
  );

-- ============================================================
-- 16. FUNCIONES AUXILIARES
-- ============================================================

-- Función para generar slug automáticamente
CREATE OR REPLACE FUNCTION public.generate_slug(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        unaccent(input_text),
        '[^a-z0-9]+', '-', 'gi'
      ),
      '^-|-$', '', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Función para crear el primer administrador
-- Ejecutar después de registrar el primer usuario en Supabase Auth
-- Reemplaza 'TU_USER_ID_AQUI' con el ID del usuario
/*
UPDATE public.profiles
SET role = 'administrador'
WHERE id = 'TU_USER_ID_AQUI';
*/

-- ============================================================
-- 17. DATOS SEMILLA (SEED)
-- ============================================================

-- Seed de contenido del sitio
INSERT INTO public.site_content (section_key, content) VALUES
  ('hero', '{"brandLabel":"Vive Travel Atlántico","title":"Descubre la Magia del","titleHighlight":"Atlántico","subtitle":"Experiencias únicas en el Caribe colombiano. Desde playas paradisíacas hasta aventuras en la naturaleza, tu próximo viaje comienza aquí.","ctaPlans":"Explorar Planes","ctaCabins":"Ver Cabañas"}'),
  ('featuredPlans', '{"title":"Planes Turísticos Destacados","subtitle":"Vive experiencias inolvidables en los rincones más hermosos del departamento del Atlántico","priceLabel":"Desde","viewMore":"Ver más","viewAll":"Ver todos los planes"}'),
  ('plansList', '{"title":"Nuestros Planes Turísticos","subtitle":"Descubre experiencias únicas en el Atlántico. Desde playas cristalinas hasta montañas impresionantes, tenemos el plan perfecto para ti.","emptyState":"No hay planes disponibles en esta categoría por el momento","viewAll":"Ver todos los planes"}'),
  ('carousel', '{"title":"Viajes que Inspiran","subtitle":"Momentos capturados de viajeros que eligieron vivir el Atlántico","brandHover":"Vive Travel","stats":[{"value":"500+","label":"Viajeros felices"},{"value":"25+","label":"Destinos"},{"value":"98%","label":"Satisfacción"},{"value":"4.9","label":"Calificación promedio"}]}'),
  ('testimonials', '{"title":"Lo que Dicen Nuestros Viajeros","subtitle":"Historias reales de quienes vivieron la experiencia Vive Travel"}'),
  ('groupTrips', '{"label":"Viajes Grupales","title":"Viaja en","titleHighlight":"Grupo","description":"Organiza viajes inolvidables con tu familia, amigos o empresa. Ofrecemos planes personalizados con descuentos especiales para grupos.","ctaQuote":"Solicitar Cotización","ctaPlans":"Ver planes","benefits":[{"title":"Descuentos grupales","description":"Hasta 20% de descuento para grupos de 8 o más personas"},{"title":"Itinerarios flexibles","description":"Fechas y horarios adaptados a tu grupo"},{"title":"Experiencias compartidas","description":"Crea recuerdos inolvidables con quienes más quieres"},{"title":"Atención personalizada","description":"Un coordinador dedicado para tu grupo"}],"stats":[{"value":"50+","label":"Viajes grupales"},{"value":"200+","label":"Participantes"},{"value":"4.9★","label":"Calificación"}]}'),
  ('customTrips', '{"label":"Viajes Personalizados","title":"Tu Viaje a","titleHighlight":"Medida","description":"Diseñamos experiencias únicas adaptadas a tus gustos, presupuesto y ritmo. Tú sueñas, nosotros lo hacemos realidad.","benefits":[{"title":"Flexibilidad total","description":"Elige tus destinos, actividades y ritmo de viaje. Tú decides cómo vivir el Atlántico."},{"title":"Expertos locales","description":"Nuestros guías conocen cada rincón del departamento y te llevan a lugares únicos."},{"title":"Mejores precios","description":"Sin intermediarios. Armamos tu viaje a medida con tarifas directas y transparentes."}],"ctaTitle":"¿Listo para tu aventura?","ctaDescription":"Cuéntanos qué tipo de experiencia buscas y diseñaremos un viaje perfecto para ti.","ctaContact":"Hablar con un experto","ctaPlans":"Ver planes"}'),
  ('cabinsList', '{"title":"Nuestras Cabañas","subtitle":"Alojamientos únicos rodeados de naturaleza en los mejores destinos del Atlántico","emptyTitle":"¿No encuentras lo que buscas?","emptyDescription":"Contáctanos y te ayudaremos a encontrar el alojamiento perfecto","contactButton":"Contactar"}'),
  ('contact', '{"badge":"Contáctanos","title":"¿Listo para","titleHighlight":"Viajar","subtitle":"Estamos aquí para ayudarte a planificar la experiencia perfecta. Escríbenos y te responderemos lo antes posible.","formTitle":"Envíanos un mensaje","whatsapp":"+57 300 123 4567","email":"info@vivetravel.co","location":"Barranquilla, Atlántico, Colombia","hours":"Lun - Sáb: 8:00 AM - 6:00 PM\\nDom: 9:00 AM - 1:00 PM","instagramUrl":"https://instagram.com/vivetravel","facebookUrl":"https://facebook.com/vivetravel","whatsappUrl":"https://wa.me/573001234567","socialLabel":"Síguenos en redes","chatTitle":"Chatea con nosotros","chatDescription":"Resolvemos tus dudas al instante por WhatsApp","chatButton":"Abrir WhatsApp"}'),
  ('policies', '{"badge":"Políticas","title":"Políticas de","titleHighlight":"Reserva","subtitle":"Transparencia y confianza en cada reserva. Conoce nuestras políticas antes de tu viaje.","bookingTitle":"Políticas de Reserva","bookingSubtitle":"Condiciones para asegurar tu experiencia","cancellationTitle":"Políticas de Cancelación","cancellationSubtitle":"Entendemos que los planes pueden cambiar","footerText":"Nos comprometemos a brindarte la mejor experiencia. Si tienes preguntas sobre nuestras políticas, no dudes en contactarnos.","lastUpdate":"Última actualización: Marzo 2025","bookingPolicies":[{"id":"booking-process","title":"Proceso de Reserva","content":"- Selecciona el plan o cabaña de tu preferencia\\n- Completa el formulario de reserva con tus datos\\n- Recibirás confirmación por correo electrónico\\n- **Pago inicial del 30%** para confirmar la reserva"},{"id":"payments","title":"Métodos de Pago","content":"- **Transferencia bancaria:** Bancolombia, Davivienda\\n- **Nequi y Daviplata:** Pago inmediato\\n- **Efectivo:** Solo en oficina física\\n- **Tarjeta de crédito:** Con recargo del 4%"},{"id":"confirmations","title":"Confirmaciones","content":"- La reserva se confirma al recibir el pago inicial\\n- Enviarás comprobante de pago a nuestro WhatsApp\\n- Recibirás voucher de confirmación en máximo 2 horas\\n- **Reservas sin pago** se mantienen por 24 horas"},{"id":"modifications","title":"Modificaciones","content":"- Cambios gratuitos hasta 48 horas antes del viaje\\n- Sujeto a disponibilidad para fechas alternas\\n- **Cambios de última hora** pueden tener costo adicional"},{"id":"requirements","title":"Requisitos","content":"- Documento de identidad válido\\n- Menores de edad con autorización de los padres\\n- Informar condiciones médicas especiales\\n- Llegar 15 minutos antes del punto de encuentro"}],"cancellationPolicies":[{"id":"early-cancellation","title":"Cancelación Anticipada","content":"- **7+ días antes:** Reembolso del 100%\\n- **3-6 días antes:** Reembolso del 70%\\n- **1-2 días antes:** Reembolso del 50%"},{"id":"late-cancellation","title":"Cancelación Tardía","content":"- **Mismo día:** Sin reembolso\\n- Se puede reprogramar una vez sin costo\\n- **No-show:** Se considera cancelación tardía"},{"id":"no-show","title":"No Presentarse","content":"- Si no te presentas sin aviso previo, no hay reembolso\\n- Es posible reprogramar con 50% de descuento\\n- **Tercera no-presentación:** Sin opciones de reprogramación"},{"id":"refunds","title":"Reembolsos","content":"- Procesamiento en 5-10 días hábiles\\n- Se devuelve por el mismo método de pago\\n- **Gastos de transacción** pueden aplicar"},{"id":"force-majeure","title":"Fuerza Mayor","content":"- ⚠️ Por condiciones climáticas extremas: reprogramación gratuita\\n- Por decisión de Vive Travel: reembolso completo\\n- **Eventos externos:** Evaluación caso por caso"}]}'),
  ('footer', '{"brandName":"Vive Travel","brandSub":"Atlántico","description":"Tu agencia de viajes y experiencias en el Caribe colombiano. Descubre los mejores planes y alojamientos en el Atlántico.","instagramUrl":"https://instagram.com/vivetravel","facebookUrl":"https://facebook.com/vivetravel","whatsappUrl":"https://wa.me/573001234567","exploreTitle":"Explorar","contactTitle":"Contacto","phone":"+57 300 123 4567","email":"info@vivetravel.co","location":"Barranquilla, Atlántico, Colombia","helpTitle":"¿Necesitas ayuda?","helpDescription":"Chatea con nosotros y resolvemos tus dudas al instante","chatButton":"Chatear ahora","copyright":"© {year} Vive Travel Atlántico. Todos los derechos reservados.","madeWith":"Hecho con ❤️ en el Caribe colombiano"}'),
  ('navbar', '{"brandName":"Vive","brandSub":"Travel","navItems":[{"key":"home","label":"Inicio"},{"key":"plans","label":"Planes"},{"key":"cabins","label":"Cabañas"},{"key":"contact","label":"Contacto"},{"key":"policies","label":"Políticas"}],"ctaButton":"Reservar ahora","ctaButtonMobile":"Reservar","adminLabel":"Admin"}')
ON CONFLICT (section_key) DO NOTHING;

-- Seed de imágenes hero
INSERT INTO public.hero_images (url, caption, sort_order) VALUES
  ('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=1080&fit=crop', 'Playas cristalinas del Caribe', 1),
  ('https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1920&h=1080&fit=crop', 'Atardeceres mágicos', 2),
  ('https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1920&h=1080&fit=crop', 'Naturaleza exuberante', 3),
  ('https://images.unsplash.com/photo-1468413253725-0d5181091126?w=1920&h=1080&fit=crop', 'Aventura en el Atlántico', 4)
ON CONFLICT DO NOTHING;

-- Seed de imágenes de viajes realizados
INSERT INTO public.trip_images (url, caption, sort_order) VALUES
  ('https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=800&fit=crop', 'Aventura en la Sierra', 1),
  ('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=800&fit=crop', 'Relax en la playa', 2),
  ('https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&h=800&fit=crop', 'Cultura local', 3),
  ('https://images.unsplash.com/photo-1504598318550-17eba1008a68?w=800&h=800&fit=crop', 'Flamencos en Galápago', 4),
  ('https://images.unsplash.com/photo-1528127269322-539801943592?w=800&h=800&fit=crop', 'Manglares del Totumo', 5),
  ('https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=800&fit=crop', 'Cabañas frente al mar', 6),
  ('https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&h=800&fit=crop', 'Senderismo eco', 7),
  ('https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&h=800&fit=crop', 'Atardecer en grupo', 8)
ON CONFLICT DO NOTHING;

-- Seed de testimonios
INSERT INTO public.testimonials (name, avatar, location, text, rating, trip_name, sort_order) VALUES
  ('María García', 'MG', 'Bogotá, Colombia', 'Una experiencia increíble. Los manglares de Totumo son mágicos y la organización fue perfecta. ¡Volveremos pronto!', 5, 'Plan Manglar Mallorquín', 1),
  ('Carlos Rodríguez', 'CR', 'Medellín, Colombia', 'La cabaña Caribe Coral superó todas nuestras expectativas. Las instalaciones impecables y la vista al mar es de otro mundo.', 5, 'Cabaña Caribe Coral', 2),
  ('Ana Martínez', 'AM', 'Barranquilla, Colombia', 'El tour al Galápago del Atlántico fue una experiencia única. Ver los flamencos en su hábitat natural es algo que todos deberían vivir.', 5, 'Tour Galápago del Atlántico', 3),
  ('Jorge Pérez', 'JP', 'Cali, Colombia', 'El viaje grupal fue espectacular. Conocimos personas increíbles y el guía fue muy profesional y amable.', 4.5, 'Viaje Grupal Costa Atlántica', 4),
  ('Laura Sánchez', 'LS', 'Cartagena, Colombia', 'El plan de noche de estrellas fue la experiencia más romántica que he vivido. El cielo del Atlántico es impresionante.', 5, 'Noche de Estrellas en la Costa', 5),
  ('Diego Torres', 'DT', 'Bucaramanga, Colombia', 'La Ruta del Bolívar Costero es perfecta para los amantes de la historia y la cultura. Muy bien organizado.', 4.5, 'Ruta del Bolívar Costero', 6)
ON CONFLICT DO NOTHING;

-- Seed de planes turísticos
INSERT INTO public.tour_plans (name, slug, short_description, full_description, price, price_range, duration, location, category_id, difficulty, schedule, meeting_point, rating, review_count, max_guests, published, sort_order) VALUES
  ('Plan Manglar Mallorquín', 'plan-manglar-mallorquin', 'Recorre los manglares más hermosos del Atlántico en una experiencia eco-turística única', 'Sumérgete en la belleza natural de los manglares de Mallorquín. Este plan incluye un recorrido en bote por los canales del manglar, avistamiento de aves y una deliciosa comida típica costeña. Ideal para familias y amantes de la naturaleza.', 85000, '$85.000 - $120.000 COP', 'Medio día (4 horas)', 'Mallorquín, Atlántico', (SELECT id FROM public.plan_categories WHERE slug = 'naturaleza'), 'Fácil', '7:00 AM - 11:00 AM', 'Parque principal de Mallorquín', 4.8, 124, 15, true, 1),
  ('Plan Playa Blanca', 'plan-playa-blanca', 'Disfruta de aguas cristalinas y arena blanca en la playa más hermosa del Atlántico', 'Escapa a Playa Blanca, donde las aguas turquesas y la arena blanca te esperan. El plan incluye transporte, almuerzo marino, sombrilla y bebida de bienvenida. Perfecto para un día de relax total bajo el sol caribeño.', 120000, '$120.000 - $180.000 COP', 'Día completo (8 horas)', 'Playa Blanca, Atlántico', (SELECT id FROM public.plan_categories WHERE slug = 'playa'), 'Fácil', '6:00 AM - 2:00 PM', 'Hotel pick-up Barranquilla', 4.9, 256, 25, true, 2),
  ('Plan Senderismo Cerro de la Vieja', 'plan-senderismo-cerro-vieja', 'Aventura de senderismo con vistas panorámicas del Atlántico', 'Conquista el Cerro de la Vieja en esta aventura de senderismo con vistas espectaculares de 360 grados del departamento del Atlántico. Incluye guía especializado, snack energético, kit de primeros auxilios y certificado de logro.', 95000, '$95.000 - $130.000 COP', 'Medio día (5 horas)', 'Cerro de la Vieja, Atlántico', (SELECT id FROM public.plan_categories WHERE slug = 'aventura'), 'Moderado', '5:00 AM - 10:00 AM', 'Entrada del Cerro de la Vieja', 4.7, 89, 12, true, 3),
  ('Plan Tour Galápago del Atlántico', 'plan-tour-galapago-atlantico', 'Avista flamencos y fauna silvestre en el santuario del Galápago', 'Visita el santuario de fauna del Galápago del Atlántico, hogar de flamencos y otras especies silvestres. Un recorrido educativo y fascinante que conecta con la naturaleza. Incluye guía ornitólogo, binoculares y refrigerio.', 75000, '$75.000 - $100.000 COP', 'Medio día (3 horas)', 'Galápago, Atlántico', (SELECT id FROM public.plan_categories WHERE slug = 'ecoturismo'), 'Fácil', '6:00 AM - 9:00 AM', 'Entrada del santuario Galápago', 4.9, 178, 20, true, 4),
  ('Plan Noche de Estrellas en la Costa', 'plan-noche-estrellas-costa', 'Contempla las estrellas en la costa atlántica con telescopio profesional', 'Vive una noche mágica bajo las estrellas en la costa del Atlántico. Con telescopio profesional y guía astronómico, descubrirás constelaciones y planetas. Incluye cena romántica, vino y manta para el frío.', 180000, '$180.000 - $250.000 COP', 'Noche (4 horas)', 'Santa Verónica, Atlántico', (SELECT id FROM public.plan_categories WHERE slug = 'experiencia'), 'Fácil', '7:00 PM - 11:00 PM', 'Hotel Santa Verónica', 5.0, 67, 8, true, 5),
  ('Plan Ruta del Bolívar Costero', 'plan-ruta-bolivar-costero', 'Recorre los lugares históricos de Simón Bolívar en la costa atlántica', 'Sigue los pasos del Libertador Simón Bolívar en esta ruta cultural por la costa atlántica. Visita sitios históricos, museos y monumentos que cuentan la historia de la independencia. Incluye guía historiador, almuerzo y transporte.', 110000, '$110.000 - $160.000 COP', 'Día completo (7 horas)', 'Galerazamba, Atlántico', (SELECT id FROM public.plan_categories WHERE slug = 'cultural'), 'Fácil', '8:00 AM - 3:00 PM', 'Museo Bolivariano', 4.6, 45, 18, true, 6)
ON CONFLICT (slug) DO NOTHING;

-- Seed de imágenes para planes
INSERT INTO public.plan_images (plan_id, url, caption, sort_order)
SELECT p.id, img.url, img.caption, img.sort_order
FROM public.tour_plans p
CROSS JOIN LATERAL (
  VALUES
    ('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop', 'Vista principal', 1),
    ('https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&h=600&fit=crop', 'Vista panorámica', 2),
    ('https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop', 'Detalle del paisaje', 3)
) AS img(url, caption, sort_order)
WHERE p.slug IN ('plan-manglar-mallorquin', 'plan-playa-blanca', 'plan-senderismo-cerro-vieja', 'plan-tour-galapago-atlantico', 'plan-noche-estrellas-costa', 'plan-ruta-bolivar-costero');

-- Seed de includes/excludes/highlights para planes
INSERT INTO public.plan_includes (plan_id, text, sort_order)
SELECT p.id, t.text, t.sort_order
FROM public.tour_plans p
CROSS JOIN LATERAL (
  VALUES
    ('Transporte ida y vuelta', 1),
    ('Guía profesional bilingüe', 2),
    ('Almuerzo típico costeño', 3),
    ('Seguro de viaje', 4),
    ('Kit de bienvenida', 5)
) AS t(text, sort_order)
WHERE p.slug IN ('plan-manglar-mallorquin', 'plan-playa-blanca', 'plan-senderismo-cerro-vieja');

INSERT INTO public.plan_excludes (plan_id, text, sort_order)
SELECT p.id, t.text, t.sort_order
FROM public.tour_plans p
CROSS JOIN LATERAL (
  VALUES
    ('Alimentación no especificada', 1),
    ('Gastos personales', 2),
    ('Propinas', 3)
) AS t(text, sort_order)
WHERE p.slug IN ('plan-manglar-mallorquin', 'plan-playa-blanca', 'plan-senderismo-cerro-vieja');

INSERT INTO public.plan_highlights (plan_id, text, sort_order)
SELECT p.id, t.text, t.sort_order
FROM public.tour_plans p
CROSS JOIN LATERAL (
  VALUES
    ('Avistamiento de fauna silvestre', 1),
    ('Paisajes únicos del Caribe', 2),
    ('Experiencia cultural auténtica', 3)
) AS t(text, sort_order)
WHERE p.slug IN ('plan-manglar-mallorquin', 'plan-playa-blanca', 'plan-senderismo-cerro-vieja');

-- Seed de cabañas
INSERT INTO public.cabins (name, slug, short_description, full_description, price_per_night, price_range, location, address, capacity, bedrooms, bathrooms, lat, lng, check_in, check_out, cancellation_policy, rating, review_count, published, sort_order) VALUES
  ('Cabaña Caribe Coral', 'cabana-caribe-coral', 'Frente al mar con vista panorámica al Caribe', 'Disfruta de una experiencia única frente al mar Caribe. Esta cabaña cuenta con todas las comodidades para una estadía perfecta, incluyendo piscina privada, terraza con vista al mar y acceso directo a la playa.', 380000, '$380.000 - $480.000 COP', 'Santa Verónica, Atlántico', 'Vía Santa Verónica, Km 15', 6, 2, 2, 10.9500, -75.0500, '3:00 PM', '11:00 AM', 'Cancelación gratuita hasta 7 días antes del check-in', 4.9, 98, true, 1),
  ('Cabaña Manglar Eco-Lodge', 'cabana-manglar-eco-lodge', 'Eco-alojamiento rodeado de manglares y naturaleza', 'Sumérgete en la naturaleza en este eco-lodge rodeado de manglares. Construido con materiales sostenibles y diseñado para minimizar el impacto ambiental, sin sacrificar comodidad.', 280000, '$280.000 - $380.000 COP', 'Mallorquín, Atlántico', 'Ciénaga de Mallorquín', 4, 1, 1, 10.9200, -74.9800, '2:00 PM', '12:00 PM', 'Cancelación gratuita hasta 5 días antes del check-in', 4.8, 76, true, 2),
  ('Cabaña Sol y Arena Familiar', 'cabana-sol-y-arena-familiar', 'Perfecta para familias, amplia y frente a la playa', 'La cabaña ideal para vacaciones familiares. Con amplios espacios, zona de juegos para niños, piscina y BBQ. Ubicada a pocos metros de la playa.', 320000, '$320.000 - $420.000 COP', 'Puerto Colombia, Atlántico', 'Calle 5, Puerto Colombia', 8, 3, 2, 10.9900, -75.0100, '3:00 PM', '11:00 AM', 'Cancelación gratuita hasta 7 días antes del check-in', 4.7, 64, true, 3),
  ('Cabaña Brisa del Mar', 'cabana-brisa-del-mar', 'Romántica cabaña con jacuzzi y vista al atardecer', 'Escapa con tu pareja a esta cabaña romántica con jacuzzi privado, terraza con vista al atardecer y todos los detalles para una estadía inolvidable.', 420000, '$420.000 - $550.000 COP', 'Playa Blanca, Atlántico', 'Playa Blanca Sector Norte', 2, 1, 1, 10.9300, -75.0800, '3:00 PM', '12:00 PM', 'Cancelación gratuita hasta 3 días antes del check-in', 5.0, 112, true, 4),
  ('Cabaña Palma Costeña', 'cabana-palma-costena', 'Auténtica cabaña costeña con piscina y jardín tropical', 'Vive la auténtica experiencia costeña en esta cabaña rodeada de palmeras y jardín tropical. Con piscina, hamacas y una cocina totalmente equipada para que te sientas como en casa.', 260000, '$260.000 - $350.000 COP', 'Tubará, Atlántico', 'Vereda La Playa, Tubará', 6, 2, 1, 10.8700, -75.0300, '2:00 PM', '11:00 AM', 'Cancelación gratuita hasta 5 días antes del check-in', 4.6, 52, true, 5)
ON CONFLICT (slug) DO NOTHING;

-- Seed de imágenes para cabañas
INSERT INTO public.cabin_images (cabin_id, url, caption, sort_order)
SELECT c.id, img.url, img.caption, img.sort_order
FROM public.cabins c
CROSS JOIN LATERAL (
  VALUES
    ('https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop', 'Vista principal', 1),
    ('https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop', 'Habitación', 2),
    ('https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop', 'Exteriores', 3)
) AS img(url, caption, sort_order)
WHERE c.slug IN ('cabana-caribe-coral', 'cabana-manglar-eco-lodge', 'cabana-sol-y-arena-familiar', 'cabana-brisa-del-mar', 'cabana-palma-costena');

-- Seed de amenities para cabañas
INSERT INTO public.cabin_amenities (cabin_id, text, sort_order)
SELECT c.id, t.text, t.sort_order
FROM public.cabins c
CROSS JOIN LATERAL (
  VALUES
    ('Piscina privada', 1),
    ('WiFi gratuito', 2),
    ('Aire acondicionado', 3),
    ('Cocina equipada', 4),
    ('Estacionamiento', 5),
    ('Terraza con vista', 6)
) AS t(text, sort_order)
WHERE c.slug IN ('cabana-caribe-coral', 'cabana-manglar-eco-lodge', 'cabana-sol-y-arena-familiar');

INSERT INTO public.cabin_highlights (cabin_id, text, sort_order)
SELECT c.id, t.text, t.sort_order
FROM public.cabins c
CROSS JOIN LATERAL (
  VALUES
    ('Frente al mar', 1),
    ('Acceso privado a la playa', 2),
    ('Atardeceres impresionantes', 3)
) AS t(text, sort_order)
WHERE c.slug IN ('cabana-caribe-coral', 'cabana-brisa-del-mar');

INSERT INTO public.cabin_rules (cabin_id, text, sort_order)
SELECT c.id, t.text, t.sort_order
FROM public.cabins c
CROSS JOIN LATERAL (
  VALUES
    ('No fiestas ni eventos', 1),
    ('No fumar dentro de la cabaña', 2),
    ('Máximo de huéspedes según capacidad', 3),
    ('Respetar horarios de silencio (10 PM - 7 AM)', 4)
) AS t(text, sort_order)
WHERE c.slug IN ('cabana-caribe-coral', 'cabana-manglar-eco-lodge', 'cabana-sol-y-arena-familiar');

-- ============================================================
-- FIN DEL ESQUEMA
-- ============================================================
