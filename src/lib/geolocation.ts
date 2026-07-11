/**
 * Geolocation utility for Vive Travel.
 * Detects the user's city with browser Geolocation API fallback to IP-based Geolocation.
 */

export async function detectUserCity(): Promise<string> {
  if (typeof window === "undefined") return "Barranquilla";

  // 1. Try Browser Geolocation first
  if (navigator.geolocation) {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 4000,
          maximumAge: 600000, // 10 minutes cache
        });
      });

      const { latitude, longitude } = position.coords;
      // Free reverse geocoding API (BigDataCloud is free, fast and requires no API key)
      const geoUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=es`;
      const res = await fetch(geoUrl);
      
      if (res.ok) {
        const data = await res.json();
        const detectedCity = data.city || data.locality || data.principalSubdivision;
        if (detectedCity) {
          return mapCityToDefault(detectedCity);
        }
      }
    } catch (error) {
      console.warn("[Geolocation] Browser positioning failed or denied. Falling back to IP detection...", error);
    }
  }

  // 2. Fallback: IP-based Geolocation
  try {
    const res = await fetch("https://ipapi.co/json/");
    if (res.ok) {
      const data = await res.json();
      if (data.city) {
        return mapCityToDefault(data.city);
      }
    }
  } catch (error) {
    console.error("[Geolocation] IP-based geolocation failed:", error);
  }

  // 3. Fallback default
  return "Barranquilla";
}

/**
 * Normalizes and maps detected city to corresponding major city or Barranquilla.
 * (e.g. Soledad, Puerto Colombia -> Barranquilla)
 */
function mapCityToDefault(city: string): string {
  if (!city) return "Barranquilla";

  const normalized = city
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .toLowerCase()
    .trim();

  // Mappings
  if (
    normalized.includes("barranquilla") ||
    normalized.includes("soledad") ||
    normalized.includes("puerto colombia") ||
    normalized.includes("galapa") ||
    normalized.includes("malambo") ||
    normalized.includes("atlantico")
  ) {
    return "Barranquilla";
  }

  if (normalized.includes("bogota")) {
    return "Bogotá";
  }

  if (normalized.includes("medellin") || normalized.includes("envigado") || normalized.includes("sabaneta") || normalized.includes("itagui")) {
    return "Medellín";
  }

  if (normalized.includes("cartagena")) {
    return "Cartagena";
  }

  if (normalized.includes("santa marta")) {
    return "Santa Marta";
  }

  if (normalized.includes("cali")) {
    return "Cali";
  }

  if (normalized.includes("bucaramanga")) {
    return "Bucaramanga";
  }

  if (normalized.includes("pereira") || normalized.includes("manizales") || normalized.includes("armenia")) {
    return "Eje Cafetero";
  }

  // Otherwise capitalize first letters of original
  return city
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
