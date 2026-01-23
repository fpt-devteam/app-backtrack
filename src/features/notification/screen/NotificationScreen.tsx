import { AppEndOfFeed, AppHeader } from "@/src/shared/components";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationScreen() {
  return (
    <SafeAreaView className="flex-1" >
      <AppHeader title='Notifications' showBackButton={false} />
      <AppEndOfFeed />
    </SafeAreaView>
  );
};

