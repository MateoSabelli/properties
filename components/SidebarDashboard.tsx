"use client";
import React, { useEffect, useState } from "react";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { Home } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import { Button } from "./ui/button";
import { FetchClients, signOutAction } from "@/app/actions";
import { AddClientForm } from "./add-client-form";
import { ClientCard } from "./client-card";

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
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  const [activeSideLink, setActiveSideLink] = useState("Dashboard");

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
                    onClick={() => setActiveSideLink(link.label)}
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

  const fetchClients = async () => {
    if (!user?.id) return;
    const { Accounts, error } = await FetchClients();
    if (!error) {
      setAccountsClients(Accounts);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [user?.id]);

  const renderContent = () => {
    switch (activeSideLink) {
      case "Dashboard":
        return (
          <>
            <div className="flex gap-2">
              {/* Aquí puedes renderizar elementos tipo animación o resumen */}
            </div>
            <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold dark:text-white">
                  Clientes
                </h2>
                <Button
                  className={showAddClientForm ? "hidden" : "block"}
                  onClick={() => setShowAddClientForm(!showAddClientForm)}>
                  Agregar Cliente
                </Button>
              </div>
              {showAddClientForm ? (
                <AddClientForm
                  onCancel={() => setShowAddClientForm(false)}
                  onClientAdded={() => {
                    setShowAddClientForm(false);
                    fetchClients();
                  }}
                />
              ) : (
                <div className="overflow-x-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 pb-4">
                    {accountsClients ? (
                      accountsClients.map((client) => (
                        <ClientCard key={client.name} {...client} />
                      ))
                    ) : (
                      <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                        Cargando...
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        );
      case "Profile":
        return <div className="p-6">Aquí va el perfil del usuario</div>;
      case "Settings":
        return <div className="p-6">Aquí están las configuraciones</div>;
      case "Logout":
        // Puedes opcionalmente manejar el logout como acción directa sin renderizar contenido
        return <div className="p-6">Cerrando Sesión...</div>;
      default:
        return <div className="p-6">Seleccione una opción</div>;
    }
  };

  return (
    <div className="flex flex-1">
      <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
        <div className="text-lg font-bold">Dashboard de {user.email}</div>
        {renderContent()}
      </div>
    </div>
  );
};
