import { AppEndOfFeed, AppHeader } from "@/src/shared/components";
import { View } from "react-native";

const NotificationRoute = () => {
  return (
    <View className="flex-1">
      <AppHeader title='Notifications' showBackButton={false} />
      <AppEndOfFeed />
    </View>
  )
}

export default NotificationRoute;