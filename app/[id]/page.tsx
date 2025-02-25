"use client";
import { useSearchParams } from "next/navigation";
import { PropertyCard } from "@/components/PropertyCard";
import { useProperties } from "@/hooks/useProperties";

export default function ClientProperties() {
  const searchParams = useSearchParams();
  const clientName = searchParams.get("cliente");
  const likes = searchParams.get("likes");
  const { properties, handleFavoriteClick } = useProperties(clientName, likes);
  if (!clientName) {
    return <div>No se especificó un cliente</div>;
  }
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 border-b pb-4 flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-2xl font-semibold mb-3">
          {likes !== "true" ? "PROPIEDADES" : "PROPIEDADES LIKEADAS"}
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {properties?.map((property) => (
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
