import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Building, Phone, Mail, MapPin, Share2 } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface ClientCardProps {
  id: string;
  name: string;
  email: string;
  phone: number;
  barrio: string;
  presupuesto: number;
  tipologia: string;
  ambientes: number;
  operacion: string;
  estado: string;
  accountsClients: any[] | null;
}

const Profile = ({
  id,
  name,
  barrio,
  tipologia,
  presupuesto,
  ambientes,
  operacion,
  phone,
  email,
  accountsClients,
}: ClientCardProps) => {
  const { toast } = useToast();
  const [client, setClient] = useState({
    id: id,
    name: name,
    email: email,
    phone: phone,
    barrio: barrio,
    presupuesto: presupuesto,
    tipologia: tipologia,
    ambientes: ambientes,
    operacion: operacion,
  });
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Juan Pérez - Agente Inmobiliario",
          text: "Contacta conmigo para encontrar tu próxima propiedad ideal",
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "¡Link copiado!",
          description: "La dirección ha sido copiada al portapapeles",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  console.log(accountsClients);
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 flex items-center justify-center">
      <Card className="w-full max-w-md mx-auto overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-32 bg-gradient-to-r from-blue-600 to-blue-400">
          <div className="absolute -bottom-16 left-6">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-white">
              <img
                src="/placeholder.svg"
                alt="Foto de perfil"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
        </div>

        <CardHeader className="pt-20">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-gray-900">{client.name}</h2>
            <p className="text-blue-600 font-medium">
              Agente Inmobiliario Senior
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-600">
              <Building className="h-5 w-5 text-blue-600" />
              <span>ABC Propiedades</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Phone className="h-5 w-5 text-blue-600" />
              <span>+54 11 5555-5555</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Mail className="h-5 w-5 text-blue-600" />
              <span>juan.perez@abcpropiedades.com</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <MapPin className="h-5 w-5 text-blue-600" />
              <span>Buenos Aires, Argentina</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm text-gray-600 border-l-4 border-blue-600 pl-3 italic">
              "Ayudando a familias a encontrar el hogar de sus sueños por más de
              10 años"
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

          <Button
            onClick={handleShare}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            <Share2 className="w-4 h-4 mr-2" />
            Compartir Tarjeta
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
