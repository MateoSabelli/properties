import { useRef } from "react";
import * as htmlToImage from "html-to-image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Building, Phone, Mail, Share2, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

interface AgentData {
  full_name: string;
  role: string;
  username: string;
  avatar_url: string;
  phone: string;
  email: string;
  inmobiliaria: string;
  descripcion: string;
  specialties: string[];
}

interface RealEstateCardProps {
  data?: AgentData;
}

const RealEstateCard = ({ data }: RealEstateCardProps) => {
  const { toast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleShareImage = async () => {
    try {
      if (!cardRef.current)
        throw new Error("No se encontró el contenedor de la tarjeta.");

      // Genera la imagen en formato PNG usando html-to-image
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3,
      });

      // Convierte la dataURL a Blob
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], "profile.png", { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "Compartir Tarjeta",
          text: "Mira mi tarjeta de perfil",
          files: [file],
        });
      } else {
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = "profile.png";
        a.click();
      }
    } catch (error) {
      console.error("Error generando o compartiendo la imagen:", error);
      toast({
        title: "Error",
        description: "No se pudo generar la imagen para compartir.",
      });
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto scrollbar-none p-6 flex flex-col items-center justify-center ">
      <div className=" h-[calc(100vh-4rem)] overflow-y-auto scrollbar-none">
        <Card
          ref={cardRef}
          className="w-full max-w-md mx-auto rounded-xl shadow-lg overflow-hidden transition-transform ">
          {/* Header - fondo degradado */}
          <div className="relative h-32 bg-gradient-to-r from-blue-600 to-blue-400">
            <div className="absolute -bottom-16 left-6">
              <img
                src={data?.avatar_url}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-white bg-white"
              />
            </div>
          </div>
          <CardHeader className="pt-20 px-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {data?.full_name || "Nombre no disponible"}
              </h2>
              <p className="text-blue-600 font-medium">Agente Inmobiliario</p>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <Building className="h-5 w-5 text-blue-600" />
                <span>{data?.inmobiliaria || "Inmobiliaria"}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="h-5 w-5 text-blue-600" />
                <span>{data?.phone || "+54 11 5555-5555"}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="h-5 w-5 text-blue-600" />
                <span>{data?.email}</span>
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
        <div className="flex flex-col gap-4 w-full max-w-md mt-2">
          <Button
            onClick={handleShareImage}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md transition-colors">
            <Share2 className="w-5 h-5 mr-2 inline-block" />
            Compartir Tarjeta
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RealEstateCard;
