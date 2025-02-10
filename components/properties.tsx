"use client";

import { useState } from "react";
import { Heart, Star, Edit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PropertyUploadForm } from "./property-upload-form";
import { PropertyEditModal } from "./property-edit-modal";
import { addProperty, FetchProperties, updateProperty } from "@/app/actions";

type Property = {
  cliente: string;
  ubicacion: string;
  direccion: string;
  precio: number;
  moneda: "USD" | "ARS";
  descripcion: string;
  link: string;
  isFavorite: boolean;
};

export function Properties({
  accountsClients,
  propertiesData,
}: {
  accountsClients: any[] | null;
  propertiesData: any[] | null;
}) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const [showAddPropertyForm, setShowAddPropertyForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<any>(null);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAddProperty = async (newProperty: any) => {
    const response = await addProperty(newProperty);
    if (!response.error) {
      const { data } = await FetchProperties();
      if (data) {
        setProperties(data);
      }
      setShowAddPropertyForm(false);
    }
  };
  const handleUpdateProperty = async (editedProperty: any) => {
    const response = await updateProperty(editedProperty);
    if (!response.error) {
      const { data } = await FetchProperties();

      if (data) {
        setProperties(data);
      }
      setShowAddPropertyForm(false);
    }
  };

  const handleEditProperty = (editedProperty: any) => {
    setProperties((prev) =>
      prev.map((prop) =>
        prop.link === editedProperty.link ? editedProperty : prop
      )
    );
  };

  console.log(properties);
  return (
    <div className="container mx-auto py-8 px-4 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-none">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold dark:text-white">
          Dashboard de propiedades
        </h2>
        <Button
          className="bg-black"
          onClick={() => setShowAddPropertyForm(!showAddPropertyForm)}>
          {showAddPropertyForm ? "Cerrar" : "Agregar Nueva Propiedad"}
        </Button>
      </div>

      {showAddPropertyForm && (
        <div className="mb-8">
          <PropertyUploadForm
            onSubmit={handleAddProperty}
            accountsClients={accountsClients}
            onCancel={() => setShowAddPropertyForm(false)}
            onClientAdded={() => {
              setShowAddPropertyForm(false);
            }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {propertiesData?.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            isFavorite={favorites[property.link]}
            onFavoriteClick={() => toggleFavorite(property.link)}
            onEditClick={() => setEditingProperty(property)}
          />
        ))}
      </div>

      {editingProperty && (
        <PropertyEditModal
          onUpdate={handleUpdateProperty}
          isOpen={!!editingProperty}
          onClose={() => setEditingProperty(null)}
          property={editingProperty}
        />
      )}
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
  onEditClick: () => void;
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
          <div className="flex gap-2">
            <button
              onClick={onEditClick}
              className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
              <Edit className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
