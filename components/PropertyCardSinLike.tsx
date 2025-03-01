"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, HomeIcon, BedDoubleIcon, SquareIcon, Bath } from "lucide-react";
import { Property } from "@/types";

export interface PropertyCardProps {
  property: Property;
  isFavorite?: boolean;
  onFavoriteClick?: () => void;
  likes?: string | null;
}

export function PropertyCardSinLike({
  property,
  isFavorite,
  onFavoriteClick,
  likes,
}: PropertyCardProps) {
  let currencySymbol = property.moneda === "USD" ? "USD" : "ARS";

  const [favorite, setFavorite] = useState(isFavorite);

  const getRoomsText = (rooms: string) => {
    if (rooms === "0") return "Monoambiente";
    return `${rooms} ambientes`;
  };

  return (
    <div className="group relative border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-md ">
      <div className="relative aspect-[4/3]">
        <Link
          href={property.link}
          target="_blank"
          className="border-2 border-gray-200 shadow-md rounded-lg">
          <Image
            src={property.imagen}
            alt={property.ubicacion}
            fill
            className="object-cover rounded-lg"
          />
        </Link>
      </div>

      <div className="space-y-1 p-4">
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
          <div className="text-xs text-gray-600">+ $220.000 expensas</div>
        </div>
      </div>
    </div>
  );
}
