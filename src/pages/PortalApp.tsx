import { AuthProvider } from '../components/auth/AuthProvider';
import ClientPortal from '../components/portal/ClientPortal';

// Client-only, excluded from prerendering. Uses Supabase auth in the browser.
export default function PortalApp() {
  return (
    <AuthProvider>
      <ClientPortal />
    </AuthProvider>
  );
}
