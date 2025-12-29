import { Text, View } from "react-native";
import { PostType } from "../../types";
import { styles } from "./styles";

export const PostStatusBadge = ({ status }: { status: PostType }) => {
  if (status === PostType.Lost) {
    return (
      <View style={[styles.badge, { backgroundColor: '#FFEDD5' }]}>
        <View style={[styles.badgeDot, { backgroundColor: '#F97316' }]} />
        <Text style={[styles.badgeText, { color: '#C2410C' }]}>Lost</Text>
      </View>
    );
  } else if (status === PostType.Found) {
    return (
      <View style={[styles.badge, { backgroundColor: '#DCFCE7' }]}>
        <View style={[styles.badgeDot, { backgroundColor: '#16A34A' }]} />
        <Text style={[styles.badgeText, { color: '#166534' }]}>Found</Text>
      </View>
    );
  } else {
    return (
      <View style={[styles.badge, { backgroundColor: '#E2E8F0' }]}>
        <View style={[styles.badgeDot, { backgroundColor: '#64748B' }]} />
        <Text style={[styles.badgeText, { color: '#334155' }]}>Resolved</Text>
      </View>
    );
  }
};
