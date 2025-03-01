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
import { useEffect, useState } from "react";
import { addClient } from "@/app/actions";

interface AddClientFormProps {
  onCancel?: () => void;
  onClientAdded?: () => void;
  onClientEdited?: () => void;
  selectedClient?: any;
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
    estado: "",
  });
  const [currency, setCurrency] = useState<"USD" | "ARS">("USD");
  const [phonePrefix, setPhonePrefix] = useState("+54");
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    barrio: false,
    presupuesto: false,
    tipologia: false,
    ambientes: false,
    operacion: false,
    estado: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClients({ ...clients, [e.target.id]: e.target.value });
    setTouched({ ...touched, [e.target.id]: true });
  };

  const handleSelectChange = (value: string, field: string) => {
    setClients({ ...clients, [field]: value });
    setTouched({ ...touched, [field]: true });
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();

    // Marcar todos los campos como tocados
    const allTouched = {
      name: true,
      email: true,
      phone: true,
      barrio: true,
      presupuesto: true,
      tipologia: true,
      ambientes: true,
      operacion: true,
      estado: true,
    };
    setTouched(allTouched);

    // Validar campos requeridos
    if (
      !clients.name ||
      !clients.operacion ||
      !clients.tipologia ||
      !clients.ambientes ||
      !clients.presupuesto ||
      !clients.barrio
    ) {
      return; // Detener el envío si faltan campos requeridos
    }

    // Combinar el prefijo seleccionado con el número ingresado
    const fullPhone = `${phonePrefix} ${clients.phone}`;
    const clientToSave = { ...clients, phone: fullPhone };

    console.log("Cliente a guardar:", clientToSave);

    const response = await addClient(clientToSave);

    if (response?.error) {
      console.error("Error al agregar cliente:", response.error);
    } else {
      console.log("Cliente guardado con éxito:", response.data);
      onCancel?.();
      onClientAdded?.();
      setClients({
        name: "",
        email: "",
        phone: "",
        barrio: "",
        presupuesto: "",
        tipologia: "",
        ambientes: "",
        operacion: "",
        estado: "",
      });
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6 my-4">
      <form className="space-y-4" onSubmit={handleAddClient}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center justify-center">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-1">
              Nombre <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Nombre del cliente "
              value={clients.name}
              onChange={handleChange}
            />
            {!clients.name && touched.name && (
              <span className="text-sm text-red-500">
                Este campo es requerido
              </span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="operacion" className="flex items-center gap-1">
              Tipo de Operación <span className="text-red-500">*</span>
            </Label>
            <Select
              required
              value={clients.operacion}
              onValueChange={(value) => handleSelectChange(value, "operacion")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccione la operación " />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Venta">Venta</SelectItem>
                <SelectItem value="Compra">Compra</SelectItem>
                <SelectItem value="Alquiler">Alquiler</SelectItem>
              </SelectContent>
            </Select>
            {!clients.operacion && touched.operacion && (
              <span className="text-sm text-red-500">
                Este campo es requerido
              </span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="tipologia" className="flex items-center gap-1">
              Tipología <span className="text-red-500">*</span>
            </Label>
            <Select
              required
              value={clients.tipologia}
              onValueChange={(value) => handleSelectChange(value, "tipologia")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccione la tipología " />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Departamento">Departamento</SelectItem>
                <SelectItem value="Casa">Casa</SelectItem>
                <SelectItem value="PH">PH</SelectItem>
                <SelectItem value="Oficina">Oficina</SelectItem>
              </SelectContent>
            </Select>
            {!clients.tipologia && touched.tipologia && (
              <span className="text-sm text-red-500">
                Este campo es requerido
              </span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="ambientes" className="flex items-center gap-1">
              Ambientes <span className="text-red-500">*</span>
            </Label>
            <Select
              required
              value={clients.ambientes}
              onValueChange={(value) => handleSelectChange(value, "ambientes")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccione la cantidad de ambientes" />
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
            {!clients.ambientes && touched.ambientes && (
              <span className="text-sm text-red-500">
                Este campo es requerido
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            <div className="flex-grow">
              <Label htmlFor="presupuesto">
                Presupuesto <span className="text-red-500">*</span>
              </Label>
              <Input
                id="presupuesto"
                name="presupuesto"
                type="number"
                placeholder="Ej: 200000"
                value={clients.presupuesto}
                onChange={handleChange}
              />
              {!clients.presupuesto && touched.presupuesto && (
                <span className="text-sm text-red-500">
                  Este campo es requerido
                </span>
              )}
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

          <div className="space-y-2">
            <Label htmlFor="barrio">
              Barrio <span className="text-red-500">*</span>
            </Label>
            <Input
              id="barrio"
              placeholder="Ingrese el barrio"
              value={clients.barrio}
              onChange={handleChange}
            />
            {!clients.barrio && touched.barrio && (
              <span className="text-sm text-red-500">
                Este campo es requerido
              </span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={clients.email}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
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

          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <Select
              onValueChange={(value) => handleSelectChange(value, "estado")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccione el estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Busqueda">Busqueda</SelectItem>
                <SelectItem value="En proceso">En proceso</SelectItem>
                <SelectItem value="Finalizado">Finalizado</SelectItem>
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
