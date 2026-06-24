import { supabase } from "@/lib/supabase";
import type { LoginFormData, RegisterFormData } from "@/features/auth/auth.schema";

export async function signUpWithEmail(data: RegisterFormData) {
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email.trim(),
    password: data.password,
    options: {
      data: {
        full_name: data.fullName.trim(),
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return authData;
}

export async function signInWithEmail(data: LoginFormData) {
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email.trim(),
    password: data.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return authData;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  return data.session;
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  return data.user;
}