import { Redirect } from 'expo-router';

export default function Index() {
  // In a real app, check if onboarding is complete via AsyncStorage
  // For this prototype, we'll start at onboarding
  return <Redirect href="/onboarding" />;
}
