import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState } from "react";
import { addClient } from "@/app/actions";

interface AddClientFormProps {
  onCancel: () => void;
  onClientAdded: () => void;
}

export function AddClientForm({ onCancel, onClientAdded }: AddClientFormProps) {
  const [clients, setClients] = useState({
    name: "",
    email: "",
    phone: "",
    barrio: "",
    presupuesto: "",
    tipologia: "",
    ambientes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClients({ ...clients, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (value: string, field: string) => {
    setClients({ ...clients, [field]: value });
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita recargar la página

    console.log("Cliente a guardar:", clients);

    const response = await addClient(clients);

    if (response?.error) {
      console.error("Error al agregar cliente:", response.error);
    } else {
      console.log("Cliente guardado con éxito:", response.data);
      onCancel();
      onClientAdded();
      setClients({
        name: "",
        email: "",
        phone: "",
        barrio: "",
        presupuesto: "",
        tipologia: "",
        ambientes: "",
      });
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6 mt-4">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">
        Agregar Nuevo Cliente
      </h3>
      <form className="space-y-4" onSubmit={handleAddClient}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              placeholder="Nombre del cliente"
              value={clients.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={clients.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              placeholder="123-456-7890"
              value={clients.phone}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="presupuesto">Presupuesto</Label>
            <Input
              id="presupuesto"
              type="number"
              placeholder="Ingrese el presupuesto"
              value={clients.presupuesto}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="tipologia">Tipología</Label>
            <Select
              onValueChange={(value) => handleSelectChange(value, "tipologia")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccione la tipología" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Departamento">Departamento</SelectItem>
                <SelectItem value="Casa">Casa</SelectItem>
                <SelectItem value="PH">PH</SelectItem>
                <SelectItem value="Oficina">Oficina</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="barrio">Barrio</Label>
            <Input
              id="barrio"
              placeholder="Ingrese el barrio"
              value={clients.barrio}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="ambientes">Ambientes</Label>
            <Input
              id="ambientes"
              type="number"
              placeholder="Número de ambientes"
              value={clients.ambientes}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Guardar Cliente</Button>
        </div>
      </form>
    </div>
  );
}
