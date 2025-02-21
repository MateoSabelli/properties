"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FetchPropertiesByClient, updatePropertyFavorite } from "../actions";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Home,
  MapPin,
  Bed,
  DollarSign,
  HomeIcon,
  BedDoubleIcon,
  SquareIcon,
  Bath,
} from "lucide-react";

export default function ClientProperties() {
  const searchParams = useSearchParams();
  const clientName = searchParams.get("cliente");
  const barrio = searchParams.get("barrio");
  const tipologia = searchParams.get("tipologia");
  const presupuesto = searchParams.get("presupuesto");
  const ambientes = searchParams.get("ambientes");
  const operacion = searchParams.get("operacion");
  const [properties, setProperties] = useState<any[] | null>(null);

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

  const handleFavoriteClick = async (property: any) => {
    const updatedProperty = {
      ...property,
      favorite: !property.favorite,
    };

    const success = await updatePropertyFavorite(updatedProperty);
    if (success && properties) {
      setProperties(
        properties.map((p) => (p.id === property.id ? updatedProperty : p))
      );
    }
  };

  if (!clientName) {
    return <div>No se especificó un cliente</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 border-b pb-4 flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-2xl font-semibold mb-3">
          Busqueda para {decodeURIComponent(clientName)}
        </h1>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary">
            <MapPin className="w-3 h-3 mr-1" />
            {decodeURIComponent(barrio || "")}
          </Badge>
          <Badge variant="secondary">
            <Home className="w-3 h-3 mr-1" />
            {decodeURIComponent(tipologia || "")}
          </Badge>
          <Badge variant="secondary">
            <DollarSign className="w-3 h-3 mr-1" />
            {decodeURIComponent(presupuesto || "")}
          </Badge>
          <Badge variant="secondary">
            <Bed className="w-3 h-3 mr-1" />
            {ambientes}
          </Badge>
          <Badge variant="outline">{decodeURIComponent(operacion || "")}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {properties?.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            isFavorite={property.favorite}
            onFavoriteClick={() => handleFavoriteClick(property)}
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
    metros: number;
    dormitorios: number;
    banos: number;
    imagen: string;
    link: string;
    descripcion: string;
    cliente: string;
    favorite: boolean;
  };
  isFavorite: boolean;
  onFavoriteClick: () => void;
}

function PropertyCard({
  property,
  isFavorite,
  onFavoriteClick,
}: PropertyCardProps) {
  let currencySymbol = "";
  if (property.moneda === "USD") {
    currencySymbol = "USD";
  } else {
    currencySymbol = "ARS";
  }

  const getRoomsText = (rooms: string) => {
    if (rooms === "0") return "Monoambiente";
    return `${rooms} ambientes`;
  };

  return (
    <Link
      href={property.link}
      target="_blank"
      className="hover:scale-105 transition-all duration-300 border-2 border-gray-200 shadow-md rounded-lg">
      <div className="group relative">
        <div className="relative aspect-[4/3] ">
          <Image
            src={property.imagen}
            alt={property.ubicacion}
            fill
            className="object-cover rounded-lg"
          />
          <button
            onClick={onFavoriteClick}
            className="absolute top-3 right-3 hover:scale-110 transition-all duration-300 z-10">
            <Heart
              className={`w-6 h-6 ${property.favorite ? " fill-red-500/90 border-white  text-white" : "text-gray-100 fill-black/50"}`}
            />
          </button>
        </div>

        <div className=" space-y-1 p-4">
          <h3 className="font-medium text-md">{property.ubicacion}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {property.direccion}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <HomeIcon className="w-4 h-4" />
              <span>{getRoomsText(property.ambientes)}</span>
            </div>
            <div className="flex items-center gap-1">
              <SquareIcon className="w-4 h-4" />
              <span>{property.metros} m²</span>
            </div>
            <div className="flex items-center gap-1">
              <BedDoubleIcon className="w-4 h-4" />
              <span>{property.dormitorios}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              <span>{property.banos}</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <p className="font-semibold text-sm">
              $
              {property.precio
                .toLocaleString("es-AR", { maximumFractionDigits: 0 })
                .replace(",", ".")}{" "}
              {currencySymbol}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
