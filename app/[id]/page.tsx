"use client";
import { useSearchParams } from "next/navigation";
import { PropertyCard } from "@/components/PropertyCard";
import { useProperties } from "@/hooks/useProperties";
import { House, Share } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
export default function ClientProperties() {
  const searchParams = useSearchParams();
  const clientName = searchParams?.get("cliente");
  const likes = searchParams?.get("likes");
  const { properties, handleFavoriteClick } = useProperties(
    clientName as string,
    likes as string
  );
  if (!clientName) {
    return <div>No se especificó un cliente</div>;
  }
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 border-b pb-4 flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-2xl font-semibold mb-3">
          {likes !== "true" ? "PROPIEDADES" : "PROPIEDADES LIKEADAS"}
        </h1>
        {/* <div className="flex items-center gap-2">
          <Button variant="outline">
            <Share className="w-4 h-4" />
            Compartir
          </Button>
        </div> */}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {properties ? (
          properties.length > 0 ? (
            properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isFavorite={property.favorite}
                likes={likes}
                onFavoriteClick={() => handleFavoriteClick(property)}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center min-h-[400px]">
              <House size={100} className="text-gray-400 mb-4" />
              <h3 className="text-xl font-medium mb-2 text-center">
                No hay propiedades registradas
              </h3>
              <p className="text-gray-500 text-center">
                Aun no hay propiedades registradas para este cliente.
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

/* {properties?.map((property) => (
  <PropertyCard
    key={property.id}
    property={property}
    isFavorite={property.favorite}
    likes={likes}
    onFavoriteClick={() => handleFavoriteClick(property)}
  />
))} */
