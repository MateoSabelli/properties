import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MapPin, Home, DollarSign, Users } from "lucide-react";
import Link from "next/link";

interface ClientCardProps {
  id: string;
  name: string;
  email: string;
  phone: number;
  barrio: string;
  presupuesto: number;
  tipologia: string;
  ambientes: number;
}

export function ClientCard({
  id,
  name,
  barrio,
  tipologia,
  presupuesto,
  ambientes,
  phone,
  email,
}: ClientCardProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-2">{name}</h3>
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
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/clients/${id}`}>Ver más</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
