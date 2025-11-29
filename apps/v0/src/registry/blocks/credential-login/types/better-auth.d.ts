/**
 * Type augmentations for better-auth client
 * Extends better-auth types with UI-specific type information
 */

declare module "better-auth/client" {
  export type AuthClient = {
    signIn: {
      email: (params: {
        email: string;
        password: string;
        rememberMe?: boolean;
        fetchOptions?: Record<string, unknown>;
      }) => Promise<{
        user?: {
          id: string;
          email?: string;
          name?: string;
          image?: string;
        };
        session?: {
          token: string;
          expiresAt: string;
        };
        twoFactorRedirect?: boolean;
      }>;
      username: (params: {
        username: string;
        password: string;
        rememberMe?: boolean;
        fetchOptions?: Record<string, unknown>;
      }) => Promise<{
        user?: {
          id: string;
          username?: string;
          name?: string;
          image?: string;
        };
        session?: {
          token: string;
          expiresAt: string;
        };
        twoFactorRedirect?: boolean;
      }>;
      phone: (params: {
        phoneNumber: string;
        password: string;
        rememberMe?: boolean;
        fetchOptions?: Record<string, unknown>;
      }) => Promise<{
        user?: {
          id: string;
          phoneNumber?: string;
          name?: string;
          image?: string;
        };
        session?: {
          token: string;
          expiresAt: string;
        };
        twoFactorRedirect?: boolean;
      }>;
    };
    session: {
      get: () => Promise<{
        user: {
          id: string;
          email?: string;
          username?: string;
          phoneNumber?: string;
          name?: string;
          image?: string;
        };
        session: {
          token: string;
          expiresAt: string;
        };
      } | null>;
    };
  };
}

export {};
