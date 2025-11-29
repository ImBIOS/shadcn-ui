export function createContext(_?: { req?: Request }) {
  return {};
}

export type Context = Awaited<ReturnType<typeof createContext>>;
