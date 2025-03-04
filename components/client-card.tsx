"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Home,
  DollarSign,
  Users,
  Newspaper,
  Ellipsis,
  Edit,
  Trash,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ClientCardProps } from "@/types";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

// Función para formatear la fecha (día, mes, año)
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "No disponible";

  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const capitalizeText = (text: string | undefined) => {
  if (!text) return "No especificado";

  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export function ClientCard({
  name,
  barrio,
  tipologia,
  presupuesto,
  ambientes,
  operacion,
  phone,
  email,
  estado,
  created_at,
  onClientClick,
}: ClientCardProps) {
  const isEmpty = (value: string | number) => {
    if (value === "" || value === 0) {
      return "No hay información";
    }
    return value;
  };

  return (
    <div className="relative group  transition-all  flex justify-center items-center cursor-pointer p-0 w-full">
      <Card className="w-full cursor-pointer hover:shadow-lg hover:shadow-gray-300">
        <CardContent className="pt-6 relative">
          <div className="flex justify-between items-center mb-4 border-b pb-3">
            <div className="flex items-center justify-center gap-2">
              <h3 className="text-xl font-bold ">
                {capitalizeText(name)} {""}
                <span className="text-xs text-gray-500">
                  ({formatDate(created_at)})
                </span>
              </h3>
            </div>
            <Badge
              variant="secondary"
              className={
                estado === "Busqueda"
                  ? "bg-sky-600 hover:bg-sky-700 text-white absolute -top-2 right-5"
                  : estado === "En proceso"
                    ? "bg-orange-500 hover:bg-orange-600 text-white absolute -top-2 right-5"
                    : estado === "Finalizado"
                      ? "bg-green-600 hover:bg-green-700 text-white absolute -top-2 right-5"
                      : "bg-gray-700 hover:bg-gray-800 text-white absolute -top-2 right-5"
              }>
              {isEmpty(estado)}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Ellipsis className="h-4 w-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="space-y-2 mr-12">
                <DropdownMenuItem
                  onClick={onClientClick}
                  className="flex items-center gap-2">
                  <Edit className="h-4 w-4 text-gray-500" />
                  Ver Detalle
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-500 flex items-center gap-2">
                  <Trash className="h-4 w-4 text-gray-500" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{isEmpty(barrio)}</span>
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
                  {ambientes === "1" ? "ambiente" : "ambientes"}
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
        </CardContent>
      </Card>
    </div>
  );
}
