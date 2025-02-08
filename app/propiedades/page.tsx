"use client";

import { useState } from "react";
import { Heart, Star, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Ejemplo de datos de propiedades
const properties = [
  {
    id: "1",
    images: ["/placeholder.svg?height=300&width=400"],
    location: "Palermo, Buenos Aires",
    address: "Av. Santa Fe 1234",
    rooms: 3,
    price: 180,
    rating: 4.92,
    dates: "05 - 10 de mar",
    isFavorite: false,
  },
  {
    id: "2",
    images: ["/placeholder.svg?height=300&width=400"],
    location: "Punta del Este, Uruguay",
    address: "Playa Brava 500",
    rooms: 2,
    price: 90,
    rating: 4.81,
    dates: "25 - 30 de abr",
    isFavorite: true,
  },
  {
    id: "3",
    images: ["/placeholder.svg?height=300&width=400"],
    location: "Mar del Plata, Argentina",
    address: "Playa Bristol 789",
    rooms: 4,
    price: 254,
    rating: 4.97,
    dates: "20 - 25 de feb",
    isFavorite: false,
  },
  {
    id: "4",
    images: ["/placeholder.svg?height=300&width=400"],
    location: "Carilo, Argentina",
    address: "Carilo Beach 123",
    rooms: 3,
    price: 70,
    rating: 4.81,
    dates: "30 de mar al 4 de abr",
    isFavorite: true,
  },
  {
    id: "5",
    images: ["/placeholder.svg?height=300&width=400"],
    location: "Pinamar, Argentina",
    address: "CE Gimnasio 456",
    rooms: 2,
    price: 100,
    rating: 5.0,
    dates: "05 - 10 de mar",
    isFavorite: false,
  },
  {
    id: "6",
    images: ["/placeholder.svg?height=300&width=400"],
    location: "Tramandaí, Brasil",
    address: "Praia do Terminal Turístico",
    rooms: 3,
    price: 100,
    rating: 4.82,
    dates: "25 de feb al 2 de mar",
    isFavorite: false,
  },
];

export function Properties() {
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Propiedades Disponibles</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            isFavorite={favorites[property.id]}
            onFavoriteClick={() => toggleFavorite(property.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface PropertyCardProps {
  property: {
    id: string;
    images: string[];
    location: string;
    address: string;
    rooms: number;
    price: number;
    rating: number;
    dates: string;
  };
  isFavorite: boolean;
  onFavoriteClick: () => void;
}

function PropertyCard({
  property,
  isFavorite,
  onFavoriteClick,
}: PropertyCardProps) {
  return (
    <div className="group">
      <div className="relative aspect-[4/3]">
        <div className="absolute top-3 left-3 z-10 bg-white px-3 py-1 rounded-full text-sm font-medium">
          Favorito entre huéspedes
        </div>
        <Image
          src={property.images[0] || "/placeholder.svg"}
          alt={property.location}
          fill
          className="object-cover rounded-xl"
        />
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
            <h3 className="font-medium">{property.location}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {property.address}
            </p>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 fill-current" />
            <span>{property.rating}</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          {property.rooms} ambientes
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {property.dates}
        </p>

        <div className="flex justify-between items-center pt-1">
          <p className="font-semibold">
            ${property.price} USD{" "}
            <span className="text-gray-600 font-normal">noche</span>
          </p>
          <Link
            href={`/properties/${property.id}`}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            <ExternalLink className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
