import { ConversationInformationScreen } from "@/src/features/chat/screens";
import { AppInlineError } from "@/src/shared/components";
import { useLocalSearchParams } from "expo-router";
import React from "react";

export default function ConversationInformationRoute() {
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
  if (!conversationId) return <AppInlineError message="Something went wrong" />;

  return <ConversationInformationScreen conversationId={conversationId} />;
}
