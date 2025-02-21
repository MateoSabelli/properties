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
  onClientEdited: () => void;
}

export function AddClientForm({
  onCancel,
  onClientAdded,
  onClientEdited,
}: AddClientFormProps) {
  const [clients, setClients] = useState({
    name: "",
    email: "",
    phone: "",
    barrio: "",
    presupuesto: "",
    tipologia: "",
    ambientes: "",
    operacion: "",
  });
  const [currency, setCurrency] = useState<"USD" | "ARS">("USD");
  const [phonePrefix, setPhonePrefix] = useState("+54");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClients({ ...clients, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (value: string, field: string) => {
    setClients({ ...clients, [field]: value });
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();

    // Combinar el prefijo seleccionado con el número ingresado
    const fullPhone = `${phonePrefix} ${clients.phone}`;
    const clientToSave = { ...clients, phone: fullPhone };

    console.log("Cliente a guardar:", clientToSave);

    const response = await addClient(clientToSave);

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
        operacion: "",
      });
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6 my-4">
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
            <div className="flex">
              <Select onValueChange={(value) => setPhonePrefix(value)}>
                <SelectTrigger className="w-24">
                  <SelectValue placeholder={phonePrefix} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="+1">Estados Unidos (+1)</SelectItem>
                  <SelectItem value="+34">España (+34)</SelectItem>
                  <SelectItem value="+52">México (+52)</SelectItem>
                  <SelectItem value="+54">Argentina (+54)</SelectItem>
                  <SelectItem value="+55">Brasil (+55)</SelectItem>
                  <SelectItem value="+56">Chile (+56)</SelectItem>
                  <SelectItem value="+57">Colombia (+57)</SelectItem>
                  <SelectItem value="+58">Venezuela (+58)</SelectItem>
                  <SelectItem value="+591">Bolivia (+591)</SelectItem>
                  <SelectItem value="+598">Uruguay (+598)</SelectItem>
                  <SelectItem value="+61">Australia (+61)</SelectItem>

                  {/* Agrega más opciones de país según sea necesario */}
                </SelectContent>
              </Select>
              <Input
                id="phone"
                placeholder="123-456-7890"
                value={clients.phone}
                onChange={handleChange}
                className="ml-2"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="operacion">Tipo de Operación</Label>
            <Select
              onValueChange={(value) => handleSelectChange(value, "operacion")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccione la operación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Venta">Venta</SelectItem>
                <SelectItem value="Compra">Compra</SelectItem>
                <SelectItem value="Alquiler">Alquiler</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex space-x-2">
            <div className="flex-grow">
              <Label htmlFor="presupuesto">Presupuesto</Label>
              <Input
                id="presupuesto"
                name="presupuesto"
                type="number"
                placeholder="Ej: 200000"
                value={clients.presupuesto}
                onChange={handleChange}
              />
            </div>
            <div className="w-24">
              <Label htmlFor="currency">Moneda</Label>
              <Select
                value={currency}
                onValueChange={(value: "USD" | "ARS") => setCurrency(value)}>
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Moneda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="ARS">ARS</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
            <Select
              onValueChange={(value) => handleSelectChange(value, "ambientes")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccione la tipología" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Monoambiente</SelectItem>
                <SelectItem value="2">2 Ambientes</SelectItem>
                <SelectItem value="3">3 Ambientes</SelectItem>
                <SelectItem value="4">4 Ambientes</SelectItem>
                <SelectItem value="5">5 Ambientes</SelectItem>
                <SelectItem value="6">6 Ambientes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-between sm:justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Guardar Cliente</Button>
        </div>
      </form>
    </div>
  );
}
