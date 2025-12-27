import { useAuth } from '@/contexts/AuthContext';
import { Href, Redirect } from 'expo-router';

export default function Index() {
  const { user } = useAuth();

  // Redirect to appropriate route based on auth state
  if (user) {
    return <Redirect href={'/(tabs)' as Href} />;
  }

  return <Redirect href={'/(auth)/login' as Href} />;
}
