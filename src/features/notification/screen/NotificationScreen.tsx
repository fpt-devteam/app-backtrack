import { AppEndOfFeed, AppHeader, HeaderTitle } from "@/src/shared/components";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationScreen() {
  return (
    <SafeAreaView className="flex-1" >
      <AppHeader left={<HeaderTitle title="Notifications" />} />
      <AppEndOfFeed />
    </SafeAreaView>
  );
};

