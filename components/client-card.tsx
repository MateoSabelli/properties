import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Home,
  DollarSign,
  Users,
  Phone,
  Mail,
  Eye,
  Edit2,
  Newspaper,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Client, EditClients } from "@/app/actions";
import { ClientEditModal } from "./client-edit-modal copy";

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
  setShowAddClientForm: (show: boolean) => void;
  fetchClients: () => void;
}

export function ClientCard({
  setShowAddClientForm,
  id,
  name,
  barrio,
  tipologia,
  presupuesto,
  ambientes,
  operacion,
  phone,
  email,
}: ClientCardProps) {
  const linkHref = `/${id}?cliente=${encodeURIComponent(name)}&barrio=${encodeURIComponent(barrio)}&tipologia=${encodeURIComponent(tipologia)}&presupuesto=${presupuesto}&ambientes=${ambientes}&operacion=${encodeURIComponent(operacion)}`;
  const { toast } = useToast();
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin + linkHref);
      toast({
        description: "Link copiado al portapapeles",
      });
      console.log("Link copiado al portapapeles");
    } catch (err) {
      console.error("Error al copiar:", err);
      toast({
        variant: "destructive",
        description: "Error al copiar el link",
      });
    }
  };
  const HandleEditClient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setShowAddClientForm(true);
      const newClientData = {
        id: id,
        name: name,
        email: email,
        phone: phone.toString(),
        barrio: barrio,
        presupuesto: presupuesto.toString(),
        tipologia: tipologia,
        ambientes: ambientes.toString(),
        operacion: operacion,
      };
      const response = await EditClients(newClientData);
      if (response.error) {
        throw response.error;
      }

      toast({
        description: "Cliente editado",
      });
      console.log("Cliente editado");
    } catch (err) {
      console.error("Error al editar:", err);
      toast({
        variant: "destructive",
        description: "Error al editar el cliente",
      });
    }
  };

  const isEmpty = (value: string | number) => {
    if (value === "" || value === 0) {
      return "No hay información";
    }
    return value;
  };

  return (
    <div className="relative group block transition-all pb-4">
      <Card className="w-full max-w-sm hover:bg-black/70 transition-all duration-300 relative">
        <div className="absolute inset-0 flex items-center z-20 justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-2">
          <Button
            variant="outline"
            size="icon"
            className="bg-white hover:bg-gray-100"
            onClick={copyToClipboard}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-white hover:bg-gray-100"
            onClick={() =>
              setClientToEdit({
                id: id,
                name: name,
                email: email,
                phone: phone.toString(),
                barrio: barrio,
                presupuesto: presupuesto.toString(),
                tipologia: tipologia,
                ambientes: ambientes.toString(),
                operacion: operacion,
              })
            }>
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold ">{name}</h3>
            <Badge
              variant="secondary"
              className="bg-blue-400 hover:bg-blue-400 text-white">
              En proceso
            </Badge>
          </div>

          <div className="space-y-2">
            <div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {isEmpty(email)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {isEmpty(phone)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {isEmpty(barrio)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {isEmpty(tipologia)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {isEmpty(presupuesto)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {isEmpty(ambientes)}{" "}
                    {ambientes === 1 ? "ambiente" : "ambientes"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Newspaper className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {isEmpty(operacion)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {clientToEdit && (
        <ClientEditModal
          onUpdate={HandleEditClient}
          isOpen={!!clientToEdit}
          onClose={() => setClientToEdit(null)}
          client={clientToEdit}
          onClientAdded={() => {
            setShowAddClientForm(false);
          }}
        />
      )}
    </div>
  );
}
