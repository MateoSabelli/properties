import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MapPin, Home, DollarSign, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

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
}

export function ClientCard({
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
  return (
    <Link
      href={`/propiedades?cliente=${encodeURIComponent(name)}`}
      className="block hover:scale-105 transition-all">
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold ">{name}</h3>
            <Badge
              variant="secondary"
              className="bg-emerald-400 hover:bg-emerald-400 text-white">
              {operacion}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-gray-500" />
              <span>{barrio}</span>
            </div>
            <div className="flex items-center">
              <Home className="w-4 h-4 mr-2 text-gray-500" />
              <span>{tipologia}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
              <span> ${presupuesto} </span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2 text-gray-500" />
              <span>{ambientes} ambientes</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
