import { useState } from "react";

interface PropertyData {
  location: string;
  address: string;
  precio: number;
  banos: number;
  dormitorios: number;
  ambientes: number;
  metros_total: number;
  link_property: string;
  photo_url: string;
}

export default function FirecrawlScraper() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleScrape = async () => {
    setLoading(true);
    setData(null);

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error al scrapear:", error);
    }

    setLoading(false);
  };

  return (
    <div>
      <h1>Scraper de Propiedades</h1>
      <input
        type="text"
        placeholder="URL de la propiedad"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button onClick={handleScrape} disabled={loading}>
        {loading ? "Scrapeando..." : "Scrapear"}
      </button>

      {data && (
        <div className="property-card">
          <h2>{data.location}</h2>
          <p>
            <strong>Dirección:</strong> {data.address}
          </p>
          <p>
            <strong>Precio:</strong> ${data.precio}
          </p>
          <p>
            <strong>Baños:</strong> {data.banos}
          </p>
          <p>
            <strong>Dormitorios:</strong> {data.dormitorios}
          </p>
          <p>
            <strong>Ambientes:</strong> {data.ambientes}
          </p>
          <p>
            <strong>Metros Totales:</strong> {data.metros_total} m²
          </p>
          <img src={data.photo_url} alt="Foto de la propiedad" />
          <a
            href={data.link_property}
            target="_blank"
            rel="noopener noreferrer">
            Ver Propiedad
          </a>
        </div>
      )}
    </div>
  );
}
