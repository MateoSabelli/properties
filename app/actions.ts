"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { data } from "autoprefixer";

export const signUpAction = async (email: string, password: string , repetirpassword: string) => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  if (password !== repetirpassword) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};

export const signInAction = async (
  email: string,
  password: string
): Promise<{ error?: string; success?: boolean; redirectPath?: string }> => {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Error en signInAction:", error.message);
    return { error: error.message, success: false };
  }

  // Si el login es correcto, devolvemos true y la ruta a la que se podría redirigir
  return { success: true, redirectPath: "/protected" };
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const FetchProfile = async () => {
  const supabase = await createClient();
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) {
    console.error("Error fetching user:", userError);
    return { error: userError };
  }
    let { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.user?.id)
  if (error) {
    console.error('Error fetching accounts:', error);
    return { data: null, error }; 
  }
  console.log(profiles);
  return { data: profiles, error };
};


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
}

interface InsertResult {
  data?: any;
  error?: any;
}

export const addClient = async (client: Client): Promise<InsertResult> => {
  const supabase = await createClient();
  const { data: session, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session?.session) {
    console.error("❌ No active session found or error fetching session:", sessionError);
    return { error: "No active session found." };
  }
  
  // Obtén el UID del usuario autenticado desde Supabase para compararlo
  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error("Error fetching user:", userError);
    return { error: userError };
  }
  // Si el userId pasado como parámetro no coincide con el que devuelve Supabase

  // Intentar la inserción con el mismo UUID
  const { data, error } = await supabase
    .from('Accounts')
    .insert([{ user_id: user?.user?.id, name: client.name, email: client.email, phone: client.phone, barrio: client.barrio, presupuesto: client.presupuesto, tipologia: client.tipologia, ambientes: client.ambientes, operacion: client.operacion, estado: client.estado }])
    .select();

  if (error) {
    console.error("Error inserting client:", error);
    return { error };
  }

  return { data };
};

export const FetchClients = async () => {
  const supabase = await createClient();
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) {
    console.error("Error fetching user:", userError);
    return { error: userError };
  }
  let { data: Accounts, error } = await supabase
    .from('Accounts')
    .select('*')
    .eq('user_id', user?.user?.id)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching accounts:', error);
    return { data: null, error }; 
  }
  return { data: Accounts, error };
};

export const EditClients = async (client: Client) => {    
  const supabase = await createClient();
  const { data: user, error: userError } = await supabase.auth.getUser();
  
  if (userError) {
    console.error("Error fetching user:", userError);
    return { error: userError };
  }

  // Remover el id del objeto de actualización ya que no debe actualizarse
  const updatedClient = {
    name: client.name,
    email: client.email,
    phone: client.phone,
    barrio: client.barrio,
    presupuesto: client.presupuesto,  // Mantener como string para coincidir con la interfaz
    tipologia: client.tipologia,
    ambientes: client.ambientes,       // Mantener como string para coincidir con la interfaz
    operacion: client.operacion,
    estado: client.estado
  };
  console.log(updatedClient);
  const { data, error } = await supabase
    .from('Accounts')
    .update(updatedClient)
    .eq('id', client.id)
    .eq('user_id', user?.user?.id)
    .select();

  if (error) {
    console.error('Error updating client:', error);
    return { error };  // Modificado para mantener consistencia en el retorno
  }

  return { data, error: null };
};

interface Property {
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


export const addProperty = async (property: Property): Promise<InsertResult> => {
  const supabase = await createClient();
  const { data: session, error: sessionError } = await supabase.auth.getSession();


  if (sessionError || !session?.session) {
    console.error("❌ No active session found or error fetching session:", sessionError);
    return { error: "No active session found." };
  }
  
  // Obtén el UID del usuario autenticado desde Supabase para compararlo
  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error("Error fetching user:", userError);
    return { error: userError };
  }
  // Si el userId pasado como parámetro no coincide con el que devuelve Supabase

  // Intentar la inserción con el mismo UUID
  const { data, error } = await supabase
    .from('properties')
    .insert([{ 
      cliente: property.cliente,
      user_id: user?.user?.id, 
      ubicacion: property.ubicacion,
      direccion: property.direccion,
      precio: property.precio,
      moneda: property.moneda,
      ambientes: property.ambientes,
      imagen: property.imagen,
      link: property.link,
      metros: property.metros,
      dormitorios: property.dormitorios,
      banos: property.banos,
      favorite: property.favorite
    }])
    .select();

  if (error) {
    console.error("Error inserting client:", error);
    return { error };
  }

  return { data };
};

export const FetchProperties = async () => {
  const supabase = await createClient();
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) {
    console.error("Error fetching user:", userError);
    return { error: userError };
  }
  let { data: Properties, error } = await supabase
    .from('properties')
    .select('*')
    .eq('user_id', user?.user?.id)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching accounts:', error);
    return { data: null, error }; // Retorna null si hay error
  }

  
  return { data: Properties, error }; // Devuelve correctamente la data
};

export const FetchPropertiesByClient = async (clientName: string) => {
  const supabase = await createClient();
  
  let { data: Properties, error } = await supabase
    .from('properties')
    .select('*')
    .eq('cliente', clientName)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching properties:', error);
    return { data: null, error };
  }

  return { data: Properties, error };
};


export const updateProperty = async (property: Property): Promise<InsertResult> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('properties')
    .update({ 
      cliente: property.cliente,
      ubicacion: property.ubicacion,
      direccion: property.direccion,
      precio: property.precio,
      moneda: property.moneda,
      ambientes: property.ambientes,
      imagen: property.imagen,
      link: property.link,
      metros: property.metros,
      dormitorios: property.dormitorios,
      banos: property.banos,
      favorite: property.favorite
    })
    .eq('id', property.id)
    .select();

  console.log("data");
  console.log(data);
  if (error) {
    console.error("Error updating property:", error);
    return { error };
  }

  return { data };
};
export const updatePropertyFavorite = async (property: Property): Promise<InsertResult> => {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('properties')
    .update({ 
      favorite: property.favorite
    })
    .eq('id', property.id)
    .select();

  console.log("data");
  console.log(data);
  if (error) {
    console.error("Error updating property:", error);
    return { error };
  }

  return { data };
};

export const uploadImage = async (file: File, user_id: string) => {
  const supabase = await createClient();
  try {
    const { error } = await supabase.storage
      .from("avatars")
      .upload(`${user_id}/img.jpg`, file);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error uploading image:", error);
    return false;
  }
};

export const fetchImage = async (user_id : string): Promise<string | null> => {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.storage
      .from("avatars")
      .createSignedUrl(`${user_id}/img.jpg`, 60); // URL válida por 60 segundos

    if (error) throw error;

    // Retorna la URL firmada si existe
    return data?.signedUrl || null;
  } catch (error) {
    console.error("Error fetching CV:", error);
    return null;
  }
};

export const uploadBanner = async (file: File, user_id: string) => {
  const supabase = await createClient();
  try {
    const { error } = await supabase.storage
      .from("banner")
      .upload(`${user_id}/banner.jpg`, file);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error uploading Banner:", error);
    return false;
  }
};

export const fetchBanner = async (user_id : string): Promise<string | null> => {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.storage
      .from("banner")
      .createSignedUrl(`${user_id}/banner.jpg`, 60); // URL válida por 60 segundos

    if (error) throw error;

    // Retorna la URL firmada si existe
    return data?.signedUrl || null;
  } catch (error) {
    console.error("Error fetching Banner:", error);
    return null;
  }
};

interface Profile {
  id: string;
  full_name: string;
  role: string;
  username: string;
  avatar_url: string;
  phone: string;
  email: string;
  inmobiliaria: string;
  descripcion: string;
  banner: string;
}

export const updateProfile = async (profile: Profile): Promise<InsertResult> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .update({ 
      full_name: profile.full_name,
      role: profile.role,
      username: profile.username,
      avatar_url: profile.avatar_url,
      phone: profile.phone,
      email: profile.email,
      inmobiliaria: profile.inmobiliaria,
      descripcion: profile.descripcion,
      banner: profile.banner,
    })
    .eq('id', profile.id)
    .select();

  if (error) {
    console.error("Error updating profile:", error);
    return { error };
  }

  return { data };
}