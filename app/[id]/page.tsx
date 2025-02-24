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
  const likes = searchParams.get("likes");
  const [properties, setProperties] = useState<any[] | null>(null);

  console.log(likes);
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
    // Actualización optimista: invertimos el estado local inmediatamente
    const updatedFavorite = !property.favorite;
    setProperties((prev) =>
      prev
        ? prev.map((p) =>
            p.id === property.id ? { ...p, favorite: updatedFavorite } : p
          )
        : []
    );

    // Preparamos el objeto para actualizar en el servidor
    const updatedProperty = { ...property, favorite: updatedFavorite };

    // Enviamos la actualización al servidor
    const success = await updatePropertyFavorite(updatedProperty);
    if (!success) {
      // Si falla, revertimos la actualización optimista
      setProperties((prev) =>
        prev
          ? prev.map((p) =>
              p.id === property.id ? { ...p, favorite: updatedFavorite } : p
            )
          : []
      );
      // Opcional: mostrar un mensaje de error (toast, etc.)
    }
  };

  if (!clientName) {
    return <div>No se especificó un cliente</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 border-b pb-4 flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-2xl font-semibold mb-3">
          {likes !== "true" ? "PROPIEDADES" : "PROPIEDADES LIKEADAS"}
        </h1>
        {/* <div className="flex gap-2 flex-wrap">
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
        </div> */}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {properties
          ?.filter((property) => (likes === "true" ? property.favorite : true))
          .map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isFavorite={property.favorite}
              likes={likes}
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
  likes: string | null;
}

function PropertyCard({
  property,
  isFavorite,
  onFavoriteClick,
  likes,
}: PropertyCardProps) {
  let currencySymbol = "";
  if (property.moneda === "USD") {
    currencySymbol = "USD";
  } else {
    currencySymbol = "ARS";
  }
  const [favorite, setFavorite] = useState(isFavorite);
  console.log(favorite);
  const getRoomsText = (rooms: string) => {
    if (rooms === "0") return "Monoambiente";
    return `${rooms} ambientes`;
  };

  return (
    <div className="group relative">
      <div className="relative aspect-[4/3] ">
        <Link
          href={property.link}
          target="_blank"
          className="hover:scale-105 transition-all duration-300 border-2 border-gray-200 shadow-md rounded-lg">
          <Image
            src={property.imagen}
            alt={property.ubicacion}
            fill
            className="object-cover rounded-lg"
          />
        </Link>
        <button
          onClick={onFavoriteClick}
          className={
            likes !== "true"
              ? "absolute top-3 right-3 hover:scale-110 transition-all duration-300 z-10"
              : "hidden"
          }>
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

        <div className="flex flex-row justify-start items-center pt-1 gap-1 relative">
          <p className="font-semibold text-md">
            $
            {property.precio
              .toLocaleString("es-AR", { maximumFractionDigits: 0 })
              .replace(",", ".")}{" "}
            {currencySymbol}{" "}
          </p>
          {/* <div className=" text-xs text-gray-600 absolute left-2  mt-8">
              +$220.000 expensas
            </div> */}
          <div className=" text-xs text-gray-600 "> + $220.000 expensas</div>
        </div>
      </div>
    </div>
  );
}
