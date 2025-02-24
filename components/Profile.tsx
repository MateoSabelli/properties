"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Building, Phone, Mail, MapPin, Share2 } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState, useRef } from "react";
import { fetchImage, FetchProfile, uploadImage } from "@/app/actions";
import html2canvas from "html2canvas";
import Avatar from "boring-avatars";

interface ProfileProps {
  user: {
    email: string;
    id: string;
    name?: string;
    [key: string]: any;
  };
}

const Profile = ({ user }: ProfileProps) => {
  const { toast } = useToast();
  const [accountsClients, setAccountsClients] = useState<any>({
    avatar_url: "",
    email: "",
    full_name: "",
    id: "",
    inmobiliaria: "",
    phone: "",
    updated_at: "",
    username: "",
    website: "",
  });

  // Referencia al contenedor de la tarjeta
  const cardRef = useRef<HTMLDivElement>(null);

  const fetchClients = async () => {
    if (!user?.id) return;
    const { data, error } = await FetchProfile();
    if (!error && data && Array.isArray(data) && data.length > 0) {
      setAccountsClients(data[0]);
    }
  };

  const handleFetchAvatar = async () => {
    const imageUrl = await fetchImage(user.id);
    if (imageUrl) {
      interface AccountsClients {
        avatar_url: string;
        email: string;
        full_name: string;
        id: string;
        inmobiliaria: string;
        phone: string;
        updated_at: string;
        username: string;
        website: string;
      }

      setAccountsClients(
        (prev: AccountsClients): AccountsClients => ({
          ...prev,
          avatar_url: imageUrl,
        })
      );
      toast({
        title: "Imagen cargada",
        description: "La imagen se ha cargado correctamente.",
      });
    } else {
      toast({
        title: "Error",
        description: "No se pudo cargar la imagen.",
      });
    }
  };
  useEffect(() => {
    fetchClients();
    handleFetchAvatar();
  }, [user?.id]);

  // Función para generar la imagen de la tarjeta
  const generateCanvas = async () => {
    if (!cardRef.current)
      throw new Error("No se encontró el contenedor de la tarjeta.");
    return await html2canvas(cardRef.current, {
      backgroundColor: null, // para preservar el fondo
      scale: 2,
    });
  };

  // Compartir genérico usando Web Share API o descargando la imagen
  const handleShareImage = async () => {
    try {
      const canvas = await generateCanvas();
      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], "profile.png", { type: "image/png" });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: "Compartir Tarjeta",
              text: "Mira mi tarjeta de perfil",
              files: [file],
            });
          } else {
            // Fallback: descarga la imagen
            const dataUrl = canvas.toDataURL("image/png");
            const a = document.createElement("a");
            a.href = dataUrl;
            a.download = "profile.png";
            a.click();
          }
        }
      }, "image/png");
    } catch (error) {
      console.error("Error generando o compartiendo la imagen:", error);
      toast({
        title: "Error",
        description: "No se pudo generar la imagen para compartir.",
      });
    }
  };

  return (
    <div className="min-h-screen  p-6 flex flex-col items-center justify-center">
      <div ref={cardRef} className="mb-6">
        <Card className="w-full max-w-md mx-auto rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105">
          {/* Header - fondo degradado */}
          <div className="relative h-32 bg-gradient-to-r from-blue-600 to-blue-400">
            <div className="absolute -bottom-16 left-6">
              <Avatar
                size={100}
                name={accountsClients.full_name}
                variant="beam" // Puedes probar variantes: "marble", "beam", "pixel"
                colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
              />
            </div>
          </div>

          <CardHeader className="pt-20 px-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {accountsClients.full_name || "Nombre no disponible"}
              </h2>
              <p className="text-blue-600 font-medium">Agente Inmobiliario</p>
            </div>
          </CardHeader>

          <CardContent className="px-6 pb-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <Building className="h-5 w-5 text-blue-600" />
                <span>{accountsClients.inmobiliaria || "Inmobiliaria"}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="h-5 w-5 text-blue-600" />
                <span>{accountsClients.phone || "+54 11 5555-5555"}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="h-5 w-5 text-blue-600" />
                <span>{accountsClients.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span>Buenos Aires, Argentina</span>
              </div>
              <div className="flex flex-col gap-2 border-t pt-3">
                <p className="text-sm text-gray-600 italic border-l-4 border-blue-600 pl-3">
                  "Descripcion del agente inmobiliario"
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">
                    Especialista en:
                  </span>
                  <div className="flex gap-2">
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                      Residencial
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                      Comercial
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                      Luxury
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-md">
        <Button
          onClick={handleShareImage}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md transition-colors">
          <Share2 className="w-5 h-5 mr-2 inline-block" />
          Compartir Tarjeta
        </Button>
      </div>
    </div>
  );
};

export default Profile;
