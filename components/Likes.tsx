import React, { useState } from "react";
import { Skeleton } from "./ui/skeleton";
import {
  Bath,
  BedDoubleIcon,
  Edit,
  Heart,
  HomeIcon,
  SquareIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type Property = {
  cliente: string;
  ubicacion: string;
  direccion: string;
  precio: number;
  moneda: "USD" | "ARS";
  ambientes: string;
  metros: number;
  dormitorios: number;
  banos: number;
  descripcion: string;
  link: string;
  isFavorite: boolean;
};

export default function Likes({
  accountsClients,
  propertiesData,
}: {
  accountsClients: any[] | null;
  propertiesData: any[] | null;
}) {
  const [client, setClient] = useState("Todos");
  const handleSelectChange = (value: string, field: string) => {
    setClient(value);
  };
  return (
    <div className="container mx-auto py-8 px-4 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-none">
      <div className="flex justify-between items-center mb-6 sm:flex-row flex-col gap-4">
        <h2 className="text-3xl font-bold dark:text-white w-full text-center sm:text-start">
          Panel de likes
        </h2>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select
            onValueChange={(value) => handleSelectChange(value, "cliente")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Buscar por cliente" />
            </SelectTrigger>
            <SelectContent>
              {/* Opción por defecto "Todos" */}
              <SelectItem key="todos" value="Todos">
                Todos
              </SelectItem>
              {accountsClients?.map((client) => (
                <SelectItem key={client.id} value={client.name}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {propertiesData ? (
          propertiesData.length > 0 ? (
            propertiesData
              .filter(
                (property) =>
                  property.favorite === true &&
                  (client === "Todos" || property.cliente === client)
              )
              .map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No se encontraron propiedades
              </p>
            </div>
          )
        ) : (
          Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 space-y-3 dark:border-neutral-700">
              <Skeleton className="h-48 rounded-2xl w-full bg-gray-200 dark:bg-neutral-700 animate-pulse" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 rounded-2xl w-42 bg-gray-200 dark:bg-neutral-700 animate-pulse" />
                <Skeleton className="h-4 rounded-2xl w-32 bg-gray-200 dark:bg-neutral-700 animate-pulse" />
                <Skeleton className="h-4 rounded-2xl w-24 bg-gray-200 dark:bg-neutral-700 animate-pulse" />
                <Skeleton className="h-4 rounded-2xl w-10 bg-gray-200 dark:bg-neutral-700 animate-pulse" />
              </div>
            </div>
          ))
        )}
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
}

function PropertyCard({ property }: PropertyCardProps) {
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
    <div className="group relative border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-md">
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
          <div className=" text-xs text-gray-600 "> + $220.000 expensas</div>
        </div>
      </div>
    </div>
  );
}
