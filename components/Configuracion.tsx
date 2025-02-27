"use client";
import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Building,
  Phone,
  Mail,
  MapPin,
  Save,
  Settings2,
  Ghost,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import RealEstateCard from "./RealEstateCard";
import {
  FetchProfile,
  uploadImage,
  fetchImage,
  uploadBanner,
  fetchBanner,
  updateProfile,
} from "@/app/actions";
import Image from "next/image";

interface AgentData {
  full_name: string;
  role: string;
  username: string;
  avatar_url: string;
  banner: string;
  phone: string;
  email: string;
  inmobiliaria: string;
  descripcion: string;
}

interface ProfileProps {
  user: {
    email: string;
    id: string;
    name?: string;
    [key: string]: any;
  };
}

const Profile = ({ user }: ProfileProps) => {
  const { toast } = useToast();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [accountsClients, setAccountsClients] = useState<any>({});
  const [agentData, setAgentData] = useState<AgentData>({
    full_name: "",
    role: "",
    username: "",
    avatar_url: "",
    banner: "",
    phone: "",
    email: "",
    inmobiliaria: "",
    descripcion: "",
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
        banner: accountsClients.banner || "",
        phone: accountsClients.phone || "",
        email: accountsClients.email || "",
        inmobiliaria: accountsClients.inmobiliaria || "",
        descripcion: accountsClients.descripcion || "",
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

  const handleUpdateProfile = async () => {
    const response = await updateProfile({ id: user.id, ...agentData });
    if (
      !response.error &&
      response.data &&
      Array.isArray(response.data) &&
      response.data.length > 0
    ) {
      setAccountsClients(response.data[0]);
      toast({
        title: "Datos guardados",
        description: "Los cambios han sido guardados exitosamente",
      });
    } else {
      toast({
        title: "Error",
        description: "No se pudo actualizar la información",
      });
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto scrollbar-none p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 ">
            Configuración de Tarjeta Virtual
          </h1>
        </div>

        <Card>
          <CardHeader className="border-b flex flex-row justify-between items-center">
            <h2 className="text-xl font-semibold ">Información Personal</h2>
            <Sheet open={previewOpen} onOpenChange={setPreviewOpen}>
              <SheetTrigger asChild>
                <Button variant="outline">Vista Previa</Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-2xl">
                <SheetHeader>
                  <SheetTitle>Vista Previa de la Tarjeta</SheetTitle>
                </SheetHeader>
                <div>
                  <RealEstateCard data={agentData} />
                </div>
              </SheetContent>
            </Sheet>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Campo de imagen de perfil */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Imagen de Perfil
                </label>
                <div className="flex flex-col items-start gap-4">
                  {/* Input file oculto */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  {agentData.avatar_url ? (
                    <button
                      className=" cursor relative w-16 h-16 rounded-full"
                      onClick={handleAvatarClick}>
                      <img
                        src={agentData.avatar_url}
                        alt="Avatar"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <Settings2 className="text-blue-600  absolute bottom-0 right-0 h-4 w-4 " />
                    </button>
                  ) : (
                    <div
                      className="w-16 h-16 rounded-full bg-gray-200 cursor-pointer"
                      onClick={handleAvatarClick}></div>
                  )}
                  <div className="space-y-2">
                    <Button onClick={handleFetchAvatar} variant="outline">
                      Cargar Avatar
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Banner
                </label>
                <div className="flex flex-col items-center gap-4">
                  {agentData.banner ? (
                    <img
                      src={agentData.banner}
                      alt="Avatar"
                      className="w-full h-16 object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200"></div>
                  )}
                  {/* <div className="space-y-2">
                    <Input
                      type="file"
                      onChange={handleBannerUpload}
                      accept="banner/*"
                    />
                    <Button onClick={handleFetchBanner} variant="outline">
                      Cargar Avatar
                    </Button>
                  </div> */}
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

            <Button
              onClick={handleUpdateProfile}
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

export default Profile;
