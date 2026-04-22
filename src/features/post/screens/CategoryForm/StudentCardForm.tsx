import { PostFormField } from "@/src/features/post/components";
import { usePostCreationStore } from "@/src/features/post/hooks";
import { DatePickerField } from "@/src/shared/components";
import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const StudentCardForm = () => {
  const cardDetail = usePostCreationStore((state) => state.cardDetail);
  const setCardNumberMasked = usePostCreationStore(
    (state) => state.setCardNumberMasked,
  );
  const setCardHolderName = usePostCreationStore(
    (state) => state.setCardHolderName,
  );

  const setCardIssueDate = usePostCreationStore(
    (state) => state.setCardIssueDate,
  );
  const setCardExpiryDate = usePostCreationStore(
    (state) => state.setCardExpiryDate,
  );
  const setCardIssuingAuthority = usePostCreationStore(
    (state) => state.setCardIssuingAuthority,
  );

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-surface"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          className="flex-1 p-lg"
          contentContainerClassName="gap-lg pb-xl"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View>
            <Text className="text-textPrimary font-normal text-2xl pr-lg tracking-tight">
              What does it look like?
            </Text>
            <Text className="text-textSecondary font-thin text-base mt-xs">
              The more unique traits you provide, the faster our AI can track it
              down.
            </Text>
          </View>

          <View className="border rounded-md overflow-hidden">
            <PostFormField
              label="Student ID"
              value={cardDetail.cardNumberMasked ?? ""}
              onChange={setCardNumberMasked}
            />

            <View className="border-t" />

            <PostFormField
              label="Holder Name"
              value={cardDetail.holderName ?? ""}
              onChange={setCardHolderName}
            />

            <View className="border-t" />

            <PostFormField
              label="School/University Name"
              value={cardDetail.issuingAuthority ?? ""}
              onChange={setCardIssuingAuthority}
            />
          </View>

          <View className="gap-sm">
            <Text className="text-textPrimary font-normal text-lg tracking-tight">
              Issue Date
            </Text>
            <DatePickerField
              value={cardDetail.issueDate}
              onChange={setCardIssueDate}
            />
          </View>

          <View className="gap-sm">
            <Text className="text-textPrimary font-normal text-lg tracking-tight">
              Expiry Date
            </Text>
            <DatePickerField
              value={cardDetail.expiryDate}
              onChange={setCardExpiryDate}
            />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default StudentCardForm;
