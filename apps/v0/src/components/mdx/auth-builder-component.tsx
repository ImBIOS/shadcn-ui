/**
 * Auth Builder Component for MDX
 *
 * A wrapper component that can be imported and used in MDX files
 * to render the AuthBuilder with proper context.
 */

import { AuthBuilder } from "../../builder/auth-builder";

export function AuthBuilderComponent() {
  return <AuthBuilder />;
}
