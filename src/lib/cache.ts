import fs from "fs/promises";
import path from "path";

const CACHE_DIR = path.join(process.cwd(), "db", "cache");

export async function writeToCache(fileName: string, data: any): Promise<void> {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    const filePath = path.join(CACHE_DIR, `${fileName}.json`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error(`[Cache Error] No se pudo escribir en la caché local (${fileName}):`, error);
  }
}

export async function readFromCache<T>(fileName: string, fallback: T): Promise<T> {
  try {
    const filePath = path.join(CACHE_DIR, `${fileName}.json`);
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content) as T;
  } catch (error) {
    // Si el archivo no existe o hay algún error de parsing, devolvemos el fallback
    return fallback;
  }
}
