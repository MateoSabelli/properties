import { NextApiRequest, NextApiResponse } from "next";
import FirecrawlApp from "@mendable/firecrawl-js";
import { z } from "zod";

const app = new FirecrawlApp({
  apiKey: process.env.NEXT_PUBLIC_FIRECRAWL_API_KEY,
});

const propertySchema = z.object({
  location: z.string().optional(),
  address: z.string().optional(),
  photo_url: z.string(),
  precio: z.number(),
  banos: z.number().optional(),
  dormitorios: z.number().optional(),
  ambientes: z.number().optional(),
  metros_total: z.number().optional(),
  link_property: z.string().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { url } = req.body;

    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "URL requerida" });
    }

    const scrapeResult = await app.extract([url], {
      prompt: "Extrae la ubicación, dirección, foto principal, precio, baños, dormitorios, ambientes y metros totales de la propiedad.",
      schema: propertySchema,
    });

    if (!scrapeResult.success) {
      return res.status(500).json({ error: `Error en scraping: ${scrapeResult.error}` });
    }

    res.status(200).json(scrapeResult.data);
  } catch (error) {
    console.error("Error en scraping:", error);
    res.status(500).json({ error: "No se pudo obtener la información" });
  }
} 