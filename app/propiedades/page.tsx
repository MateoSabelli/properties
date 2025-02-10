/* "use client";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FetchPropertiesByClient } from "../actions";
import { useSearchParams } from "next/navigation";

export default function Properties() {
  const searchParams = useSearchParams();
  const clientName = searchParams.get("cliente");
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const [accountsClients, setAccountsClients] = useState<any[] | null>(null);
  const [name, setName] = useState<string>("");
  const [properties, setProperties] = useState<any[] | null>(null);
  const [selectedClient, setSelectedClient] = useState<string | null>(
    "Mariano Sabelli"
  );

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const fetchPropertiesByClient = async (clientName: string) => {
    const { data: properties, error } =
      await FetchPropertiesByClient(clientName);
    if (!error && properties) {
      setProperties(properties);
    }
  };

  useEffect(() => {
    const fetchProperties = async () => {
      if (clientName) {
        const { data, error } = await FetchPropertiesByClient(clientName);
        if (!error && data) {
          setProperties(data);
        }
      }
    };

    fetchProperties();
  }, [clientName]);

  if (!clientName) {
    return <div>No se especificó un cliente</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">
        Propiedades para {decodeURIComponent(clientName)}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {properties?.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            isFavorite={favorites[property.id]}
            onFavoriteClick={() => toggleFavorite(property.id)}
            onEditClick={() => {}}
          />
        ))}
      </div>
    </div>
  );
}

interface PropertyCardProps {
  property: {
    id: string;
    ubicacion: string;
    direccion: string;
    precio: number;
    moneda: "USD" | "ARS";
    ambientes: string;
    imagen: string;
    link: string;
    descripcion: string;
    cliente: string;
  };
  isFavorite: boolean;
  onFavoriteClick: () => void;
  onEditClick?: () => void;
}

function PropertyCard({
  property,
  isFavorite,
  onFavoriteClick,
  onEditClick,
}: PropertyCardProps) {
  let currencySymbol = "";
  if (property.moneda === "USD") {
    currencySymbol = "$";
  } else {
    currencySymbol = "ARS";
  }

  const getRoomsText = (rooms: string) => {
    if (rooms === "0") return "Monoambiente";
    return `${rooms} ambientes`;
  };

  return (
    <div className="group relative">
      <div className="relative aspect-[4/3] hover:scale-105 transition-all duration-300">
        <Link
          href={property.link}
          target="_blank"
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 ">
          <Image
            src={property.imagen}
            alt={property.ubicacion}
            fill
            className="object-cover rounded-xl"
          />
        </Link>
        <button
          onClick={onFavoriteClick}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-10">
          <Heart
            className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`}
          />
        </button>
      </div>

      <div className="mt-3 space-y-1">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-medium">{property.ubicacion}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {property.direccion}
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          {getRoomsText(property.ambientes)}
        </p>

        <div className="flex justify-between items-center pt-1">
          <p className="font-semibold">
            {currencySymbol}
            {property.precio.toLocaleString()}{" "}
          </p>
        </div>
      </div>
    </div>
  );
}
 */
