import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Building, Phone, Mail, MapPin, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import RealEstateCard from "./RealEstateCard";
import { FetchProfile, uploadImage, fetchImage } from "@/app/actions";
import Image from "next/image";

interface AgentData {
  full_name: string;
  role: string;
  username: string;
  avatar_url: string;
  phone: string;
  email: string;
  inmobiliaria: string;
  descripcion: string;
  specialties: string[];
}

interface ProfileProps {
  user: {
    email: string;
    id: string;
    name?: string;
    [key: string]: any;
  };
}

const CardConfig = ({ user }: ProfileProps) => {
  const { toast } = useToast();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [accountsClients, setAccountsClients] = useState<any>({});
  const [agentData, setAgentData] = useState<AgentData>({
    full_name: "",
    role: "",
    username: "",
    avatar_url: "",
    phone: "",
    email: "",
    inmobiliaria: "",
    descripcion: "",
    specialties: [],
  });

  const fetchClients = async () => {
    if (!user?.id) return;
    const { data, error } = await FetchProfile();
    if (!error && data && Array.isArray(data) && data.length > 0) {
      setAccountsClients(data[0]);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [user?.id]);

  useEffect(() => {
    if (accountsClients?.full_name) {
      setAgentData({
        full_name: accountsClients.full_name,
        role: accountsClients.role || "",
        username: accountsClients.username || "",
        avatar_url: accountsClients.avatar_url || "",
        phone: accountsClients.phone || "",
        email: accountsClients.email || "",
        inmobiliaria: accountsClients.inmobiliaria || "",
        descripcion: accountsClients.descripcion || "",
        specialties: accountsClients.specialties || [],
      });
    }
  }, [accountsClients]);

  const handleChange = (field: keyof AgentData, value: string) => {
    setAgentData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSpecialtiesChange = (value: string) => {
    const specialties = value.split(",").map((s) => s.trim());
    setAgentData((prev) => ({
      ...prev,
      specialties,
    }));
  };

  const handleSave = () => {
    toast({
      title: "Datos guardados",
      description: "Los cambios han sido guardados exitosamente",
    });
  };

  // Función para cargar la imagen usando fetchImage
  const handleFetchAvatar = async () => {
    const imageUrl = await fetchImage(user.id);
    if (imageUrl) {
      setAgentData((prev) => ({
        ...prev,
        avatar_url: imageUrl,
      }));
      toast({
        title: "Imagen cargada",
        description: "La imagen se ha cargado correctamente.",
      });
    } else {
      toast({
        title: "Error",
        description: "No se pudo cargar la imagen.",
      });
    }
  };

  // Función para manejar el cambio en el input de imagen y subirla
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const success = await uploadImage(file, user.id);
    if (success) {
      // Asumiendo que la URL pública es conocida (ajustá según tu configuración de Supabase)
      const imageUrl = `https://YOUR_SUPABASE_URL/storage/v1/object/public/avatars/${user.id}/img.jpg`;
      setAgentData((prev) => ({
        ...prev,
        avatar_url: imageUrl,
      }));
      toast({
        title: "Imagen subida",
        description: "La imagen se ha subido correctamente.",
      });
      // Llamamos a handleFetchAvatar para cargar automáticamente la imagen firmada
      await handleFetchAvatar();
    } else {
      toast({
        title: "Error",
        description: "No se pudo subir la imagen.",
      });
    }
  };
  useEffect(() => {
    if (user?.id) {
      handleFetchAvatar();
    }
  }, [user?.id]);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Configuración de Tarjeta Virtual
          </h1>
          <Sheet open={previewOpen} onOpenChange={setPreviewOpen}>
            <SheetTrigger asChild>
              <Button variant="outline">Vista Previa</Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-2xl">
              <SheetHeader>
                <SheetTitle>Vista Previa de la Tarjeta</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <RealEstateCard data={agentData} />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <Card>
          <CardHeader className="border-b">
            <h2 className="text-xl font-semibold">Información Personal</h2>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Campo de imagen de perfil */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Imagen de Perfil
                </label>
                <div className="flex items-center gap-4">
                  {agentData.avatar_url ? (
                    <img
                      src={agentData.avatar_url}
                      alt="Avatar"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200"></div>
                  )}
                  <div className="space-y-2">
                    <Input
                      type="file"
                      onChange={handleImageUpload}
                      accept="image/*"
                    />
                    {/* Botón para cargar la imagen usando fetchImage */}
                    <Button onClick={handleFetchAvatar} variant="outline">
                      Cargar Avatar
                    </Button>
                  </div>
                </div>
              </div>
              {/* Otros campos */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Nombre Completo
                </label>
                <Input
                  value={agentData.full_name}
                  onChange={(e) => handleChange("full_name", e.target.value)}
                  placeholder={accountsClients.full_name || "Nombre Completo"}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Cargo
                </label>
                <Input
                  value={agentData.role}
                  onChange={(e) => handleChange("role", e.target.value)}
                  placeholder={accountsClients.role || "Cargo"}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Empresa
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  className="pl-10"
                  value={agentData.inmobiliaria}
                  onChange={(e) => handleChange("inmobiliaria", e.target.value)}
                  placeholder={accountsClients.inmobiliaria || "Inmobiliaria"}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    className="pl-10"
                    value={agentData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder={accountsClients.phone || "+54 11 5555-5555"}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    className="pl-10"
                    value={agentData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    type="email"
                    placeholder={accountsClients.email || "Correo Electrónico"}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Frase Personal
              </label>
              <Input
                value={agentData.descripcion}
                onChange={(e) => handleChange("descripcion", e.target.value)}
                placeholder={accountsClients.descripcion || "Descripción"}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Especialidades
              </label>
              <Input
                value={agentData.specialties.join(", ")}
                onChange={(e) => handleSpecialtiesChange(e.target.value)}
                placeholder="Especialidades separadas por comas"
              />
              <p className="text-sm text-gray-500">
                Separa las especialidades con comas (ej: Residencial, Comercial,
                Luxury)
              </p>
            </div>

            <Button
              onClick={handleSave}
              className="w-full bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Guardar Cambios
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CardConfig;
