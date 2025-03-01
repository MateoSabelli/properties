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
import { useEffect, useState } from "react"; // Asegúrate de tener una función para actualizar clientes
import { EditClients } from "@/app/actions";
import Image from "next/image";
import { Badge } from "./ui/badge";
interface EditClientFormProps {
  onClientUpdated?: () => void;
  clientData: any; // Cambia `any` por el tipo adecuado
}

export function EditClientForm({
  onClientUpdated,
  clientData,
}: EditClientFormProps) {
  const [client, setClient] = useState(clientData);
  const [currency, setCurrency] = useState<"USD" | "ARS">("USD");
  const [phonePrefix, setPhonePrefix] = useState("+54");

  const countryFlags: Record<string, { code: string; name: string }> = {
    "+1": { code: "US", name: "Estados Unidos" },
    "+34": { code: "ES", name: "España" },
    "+52": { code: "MX", name: "México" },
    "+54": { code: "AR", name: "Argentina" },
    "+55": { code: "BR", name: "Brasil" },
    "+56": { code: "CL", name: "Chile" },
    "+57": { code: "CO", name: "Colombia" },
    "+58": { code: "VE", name: "Venezuela" },
    "+591": { code: "BO", name: "Bolivia" },
    "+598": { code: "UY", name: "Uruguay" },
    "+61": { code: "AU", name: "Australia" },
  };

  useEffect(() => {
    if (clientData) {
      setClient(clientData);
    }
  }, [clientData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClient({ ...client, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (value: string, field: string) => {
    setClient({ ...client, [field]: value });
  };

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();

    // Combinar el prefijo seleccionado con el número ingresado
    const fullPhone = `${phonePrefix} ${client.phone}`;
    const clientToUpdate = { ...client, phone: fullPhone };

    console.log("Cliente a actualizar:", clientToUpdate);

    const response = await EditClients(clientToUpdate);

    if (response?.error) {
      console.error("Error al actualizar cliente:", response.error);
    } else {
      console.log("Cliente actualizado con éxito:", response.data);
      onClientUpdated?.();
    }
  };

  const isEmpty = (value: string) => {
    if (value === "" || value === null || value === undefined) {
      return "No seleccionado";
    }
    return value;
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6 my-4">
      <div className="flex flex-row justify-between items-center pb-4">
        <h2 className="text-2xl font-bold dark:text-white">
          Información del cliente
        </h2>
        <Badge
          variant="secondary"
          className={
            client.estado === "Busqueda"
              ? "bg-blue-400 text-white"
              : client.estado === "En proceso"
                ? "bg-indigo-950 text-white"
                : "bg-green-700 text-white"
          }>
          {client.estado}
        </Badge>
      </div>
      <form className="space-y-4" onSubmit={handleUpdateClient}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              placeholder="Nombre del cliente"
              value={isEmpty(client.name)}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={isEmpty(client.email)}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <div className="flex">
              <Select onValueChange={(value) => setPhonePrefix(value)}>
                <SelectTrigger className="w-24">
                  <SelectValue>
                    <Image
                      src={`https://flagcdn.com/${countryFlags[phonePrefix]?.code.toLowerCase()}.svg`}
                      alt={countryFlags[phonePrefix]?.name}
                      width={24}
                      height={16}
                    />
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(countryFlags).map(
                    ([prefix, { code, name }]) => (
                      <SelectItem key={prefix} value={prefix}>
                        <div className="flex items-center gap-2">
                          <Image
                            src={`https://flagcdn.com/${code.toLowerCase()}.svg`}
                            alt={name}
                            width={24}
                            height={16}
                          />
                          <span>{name}</span>
                        </div>
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              <Input
                id="phone"
                placeholder="123-456-7890"
                value={client.phone}
                onChange={handleChange}
                className="ml-2"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="operacion">Tipo de Operación</Label>
            <Select
              value={isEmpty(client.operacion)}
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
                value={isEmpty(client.presupuesto)}
                onChange={handleChange}
              />
            </div>
            <div className="w-24">
              <Label htmlFor="currency">Moneda</Label>
              <Select
                value={isEmpty(currency)}
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
              value={isEmpty(client.tipologia)}
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
              value={client.barrio}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="ambientes">Ambientes</Label>
            <Select
              value={isEmpty(client.ambientes?.toString())}
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
          </div>
          <div>
            <Label htmlFor="estado">Estado</Label>
            <Select
              value={isEmpty(client.estado)}
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
          <Button type="submit">Guardar Cambios</Button>
        </div>
      </form>
    </div>
  );
}
