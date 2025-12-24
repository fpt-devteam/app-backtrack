import { timeSincePast } from "@/src/shared/utils/datetime.utils";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { PREFIX_PATH_REPORT } from "../../constants/report.constant";
import { ReportType, type ReportPost } from "../../types/report.type";
import styles from "./style";

interface ReportCardProps {
  item: ReportPost;
}

const ReportCard = ({ item }: ReportCardProps) => {
  const postedAgo = useMemo(() => timeSincePast(item.createdAt), [item.createdAt]);
  const imageUrl = item.imageUrls?.[0];

  const handleOpenDetail = useCallback(() => {
    router.push(`${PREFIX_PATH_REPORT}/${item.id}`);
  }, [item.id]);

  const isLost = item.postType === ReportType.LOST;

  return (
    <Pressable onPress={handleOpenDetail} style={styles.card}>
      {/* Image header */}
      <View style={styles.imageWrap}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.imageFallback} />
        )}
      </View>

      {/* Content */}
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {item.itemName}
          </Text>

          <View style={[styles.badgeInline, isLost ? styles.badgeLost : styles.badgeFound]}>
            <Text style={[styles.badgeTextInline, isLost ? styles.badgeTextLost : styles.badgeTextFound]}>
              {item.postType.toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={styles.subtitle} numberOfLines={2}>
          {item.description}
        </Text>

        {/* Meta rows */}
        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={16} color="#64748B" />
          <Text style={styles.metaText} numberOfLines={1}>
            {item.displayAddress ?? "Near here"}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Ionicons name="time-outline" size={16} color="#64748B" />
          <Text style={styles.metaText}>Posted {postedAgo}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default ReportCard;
