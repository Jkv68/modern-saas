// src/hooks.server.ts
import { ENV } from "$lib/server/env";
import { createSupabaseServerClient } from "@supabase/auth-helpers-sveltekit";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  // server-side Supabase client
  event.locals.supabase = createSupabaseServerClient({
    supabaseUrl: ENV.PUBLIC_SUPABASE_URL,
    supabaseKey: ENV.PUBLIC_SUPABASE_ANON_KEY,
    event,
  });

  // helper function,  
  // instead of calling `const { data: { session } } = await supabase.auth.getSession()`
  // Call this `await getSession()`
  event.locals.getSession = async () => {
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession();
    return session;
  };

  return resolve(event, {
    /**
     * There´s an issue with `filterSerializedResponseHeaders` not working when using `sequence`
     * https://github.com/sveltejs/kit/issues/8061
     */
    filterSerializedResponseHeaders(name) {
      return name === "content-range";
    },
  });
};