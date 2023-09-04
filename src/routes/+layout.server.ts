import type { LayoutServerLoad } from "./$types";  // The generic form of LayoutServerLoad. You should import those from ./$types 

export const load: LayoutServerLoad = async (event) => {
  return {
    session: await event.locals.getSession(),
  };
};