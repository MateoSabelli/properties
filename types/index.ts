export interface Property {
    id: string;
    cliente: string;
    ubicacion: string;
    direccion: string;
    precio: number;
    moneda: string;
    ambientes: string;
    metros: number;
    dormitorios: number;
    banos: number;
    imagen: string;
    link: string;
    favorite: boolean;
}

export interface Client {
    id?: string;
    name: string;
    email: string;
    phone: string;
    barrio: string;
    presupuesto: string;
    tipologia: string;
    ambientes: string;
    operacion: string;
    estado: string;
    created_at?: string;
}


export interface ClientCardProps {
  id: string;
  name: string;
  email: string;
  phone: string;
  barrio: string;
  presupuesto: string;
  tipologia: string;
  ambientes: string;
  operacion: string;
  estado: string;
  setShowAddClientForm: (show: boolean) => void;
  fetchClients: () => void;
  onFavoriteChange?: (isFavorite: boolean) => void;
  propertiesData: Property[] | null;
  onClientClick: () => void;
}

export interface ClientModalProps {
  selectedClient: Client;
  setClientToEdit: (client: Client | null) => void;
  onClose: () => void;
  copyToClipboard: () => Promise<void>;
  copyToClipboardFavorite: () => Promise<void>;
  propertiesData: Property[] | null;
}

export interface ClientEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
  onUpdate: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  onClientAdded: () => void;
} 