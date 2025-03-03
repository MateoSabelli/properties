"use client";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Home, DollarSign, Users, Newspaper } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ClientCardProps } from "@/types";

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
  onClientClick,
}: ClientCardProps) {
  const isEmpty = (value: string | number) => {
    if (value === "" || value === 0) {
      return "No hay información";
    }
    return value;
  };

  return (
    <div
      className="relative group transition-all pb-4 flex justify-center items-center cursor-pointer p-0 w-full"
      onClick={onClientClick}>
      <Card className="w-full cursor-pointer">
        <CardContent className="pt-6 relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold ">{name}</h3>
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
          </div>

          <div>
            <div className="space-y-2">
              {/* <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{isEmpty(email)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{isEmpty(phone)}</span>
              </div> */}
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
