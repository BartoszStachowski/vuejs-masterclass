import { supabase } from '@/lib/supabaseClient';
import type { LoginForm, RegisterForm } from '@/types/AuthForm';

// const authStore = useAuthStore();

export const register = async (formData: RegisterForm) => {
  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
  });

  if (error) return console.log(error);

  if (data.user) {
    const { error } = await supabase.from('profiles').insert({
      id: data.user.id,
      username: formData.username,
      full_name: `${formData.firstName} ${formData.lastName}`,
    });

    if (error) return console.log(`Profiles err: ${error.message}`);
  }

  // await authStore.setAuth(data.session);
  return true;
};

export const login = async (formData: LoginForm) => {
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  });

  return { error };
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) return console.log(error);

  // await authStore.setAuth();
  return true;
};
