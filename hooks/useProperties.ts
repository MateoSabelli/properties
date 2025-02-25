//// filepath: /c:/Users/mateo/OneDrive/Escritorio/properties/hooks/useProperties.ts
import { useEffect, useState } from "react";
import { FetchPropertiesByClient, updatePropertyFavorite } from "@/app/actions";

export const useProperties = (clientName: string | null, likes: string | null) => {
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
    const updatedFavorite = !property.favorite;
    setProperties((prev) =>
      prev
        ? prev.map((p) =>
            p.id === property.id ? { ...p, favorite: updatedFavorite } : p
          )
        : []
    );

    const updatedProperty = { ...property, favorite: updatedFavorite };

    const success = await updatePropertyFavorite(updatedProperty);
    if (!success) {
      // Revertir si falla la actualización
      setProperties((prev) =>
        prev
          ? prev.map((p) =>
              p.id === property.id ? { ...p, favorite: !updatedFavorite } : p
            )
          : []
      );
    }
  };

  // Filtra las propiedades según si se quieren likeadas
  const filteredProperties = properties?.filter((property) =>
    likes === "true" ? property.favorite : true
  );

  return { properties: filteredProperties, handleFavoriteClick };
};