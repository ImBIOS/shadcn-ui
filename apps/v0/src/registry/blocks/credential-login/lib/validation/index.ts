/**
 * Validation schemas for authentication forms
 * All schemas use Zod for runtime type validation
 */

export {
  type EmailCredential,
  emailCredentialSchema,
  emailSchema,
} from "./email-schema";
export {
  defaultPasswordSchema,
  getPasswordSchema,
} from "./password-schema";

export {
  type PhoneCredential,
  phoneCredentialSchema,
  phoneSchema,
} from "./phone-schema";
export {
  type UsernameCredential,
  usernameCredentialSchema,
  usernameSchema,
} from "./username-schema";
