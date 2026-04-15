import { ProfilePublicScreen } from "@/src/features/profile/screens";
import { AppInlineError } from "@/src/shared/components";
import { useLocalSearchParams } from "expo-router";
import React from "react";

const PublicProfileScreen = () => {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  if (!userId) return <AppInlineError message="Something went wrong" />;

  return <ProfilePublicScreen userId={userId} />;
};

export default PublicProfileScreen;
