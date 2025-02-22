"use client";
import React, { useEffect, useState } from "react";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { Home, FileUser } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import { Button } from "./ui/button";
import { FetchClients, FetchProperties, signOutAction } from "@/app/actions";
import { Properties } from "./properties";
import Clients from "./Clients";
import DashboardPage from "./Dashboard";
import Configuracion from "./Configuracion";

interface SidebarDemoProps {
  user: {
    email: string;
    id: string;
    name?: string;
    [key: string]: any;
  };
}

export function SidebarDemo({ user }: SidebarDemoProps) {
  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Clientes",
      href: "#",
      icon: (
        <FileUser className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Propiedades",
      href: "#",
      icon: (
        <Home className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "#",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      onClick: signOutAction,
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  const [activeSideLink, setActiveSideLink] = useState(() => {
    // Intentar obtener el valor guardado en localStorage
    const savedLink = localStorage.getItem("lastActiveLink");
    // Si existe un valor guardado, usarlo; si no, usar "Dashboard"
    return savedLink || "Dashboard";
  });

  // Actualizar localStorage cuando cambie activeSideLink
  useEffect(() => {
    localStorage.setItem("lastActiveLink", activeSideLink);
  }, [activeSideLink]);

  const handleClick = (link: string) => {
    setActiveSideLink(link);
    setOpen(false);
  };

  return (
    <div
      className={cn(
        "rounded-md p-0 flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-[100vh]"
      )}>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            {
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink
                    key={idx}
                    link={link}
                    onClick={() => handleClick(link.label)}
                  />
                ))}
                {open ? <Logout /> : <LogoutIcon />}
              </div>
            }
          </div>
          <div>
            <SidebarLink
              link={{
                label: user.email,
                href: "#",
                icon: (
                  <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard user={user} activeSideLink={activeSideLink} />
    </div>
  );
}
export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre">
        Acet Labs
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};
export const Logout = () => {
  return (
    <Button
      variant={"ghost"}
      onClick={signOutAction}
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre">
        Cerrar sesion
      </motion.span>
    </Button>
  );
};
export const LogoutIcon = () => {
  return (
    <Button
      variant={"ghost"}
      onClick={signOutAction}
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    </Button>
  );
};

interface DashboardProps extends SidebarDemoProps {
  activeSideLink: string;
}

// Dummy dashboard component with content
const Dashboard = ({ user, activeSideLink }: DashboardProps) => {
  const [showAddClientForm, setShowAddClientForm] = useState(false);
  const [accountsClients, setAccountsClients] = useState<any[] | null>(null);
  const [name, setName] = useState<any[] | null>(null);
  const [propertiesData, setPropertiesData] = useState<any[] | null>(null);

  const fetchClients = async () => {
    if (!user?.id) return;
    const { data, error } = await FetchClients();
    const { data: properties, error: propertiesError } =
      await FetchProperties();

    if (!error && data) {
      setAccountsClients(data);
      setName(data[0]?.name || "");
    }
    if (!propertiesError && properties) {
      setPropertiesData(properties);
    }
  };
  useEffect(() => {
    fetchClients();
    FetchProperties();
  }, [user?.id]);

  const renderContent = () => {
    switch (activeSideLink) {
      case "Dashboard":
        return (
          <DashboardPage
            accountsClients={accountsClients}
            propertiesData={propertiesData}
          />
        );
      case "Clientes":
        return (
          <Clients
            showAddClientForm={showAddClientForm}
            setShowAddClientForm={setShowAddClientForm}
            accountsClients={accountsClients}
            fetchClients={fetchClients}
          />
        );
      case "Propiedades":
        return (
          <Properties
            accountsClients={accountsClients}
            propertiesData={propertiesData}
          />
        );

      case "Profile":
        return <div className="p-6">Aquí va el perfil del usuario</div>;

      case "Settings":
        return <Configuracion />;
      case "Logout":
        return <p>Cerrando sesion...</p>;
      default:
        return <div className="p-6">Seleccione una opción</div>;
    }
  };

  return (
    <div className="flex flex-1 bg-gray-50">
      <div className="p-2 md:p-10 rounded-tl-2x  dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
        {renderContent()}
      </div>
    </div>
  );
};
