import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth.store";
import { useEffect } from "react";

export function useAuthSession() {
  const setUser = useAuthStore((state) => state.setUser);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      try {
        setIsLoading(true);

        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (!mounted) return;

        if (data.session?.user) {
          setUser({
            id: data.session.user.id,
            email: data.session.user.email ?? "",
            fullName:
              data.session.user.user_metadata?.full_name ??
              data.session.user.email ??
              "Usuário Kairos",
          });
        } else {
          clearAuth();
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? "",
          fullName:
            session.user.user_metadata?.full_name ??
            session.user.email ??
            "Usuário Kairos",
        });
      } else {
        clearAuth();
      }

      setIsLoading(false);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [clearAuth, setIsLoading, setUser]);
}