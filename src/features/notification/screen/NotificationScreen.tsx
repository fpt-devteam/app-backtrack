import { AppEndOfFeed, AppHeader } from "@/src/shared/components";
import { View } from "react-native";

export default function NotificationScreen() {
  return (
    <View className="flex-1" >
      <AppHeader title='Notifications' showBackButton={false} />
      <AppEndOfFeed />
    </View>
  );
};

