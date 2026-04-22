import {
  PostFormField,
  PostFormTextArea,
} from "@/src/features/post/components";
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

const BankCardForm = () => {
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
  const setCardAiDescription = usePostCreationStore(
    (state) => state.setCardAiDescription,
  );
  const postTitle = usePostCreationStore((state) => state.postTitle);
  const updatePostTitle = usePostCreationStore(
    (state) => state.updatePostTitle,
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
              label="Post Title"
              value={postTitle}
              onChange={updatePostTitle}
            />

            <View className="border-t" />

            <PostFormField
              label="Card Number"
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
              label="Bank Name"
              value={cardDetail.issuingAuthority ?? ""}
              onChange={setCardIssuingAuthority}
            />
          </View>

          <View className="gap-sm">
            <Text className="text-textPrimary font-normal text-lg tracking-tight">
              Valid From
            </Text>
            <DatePickerField
              value={cardDetail.issueDate}
              onChange={setCardIssueDate}
              placeholder="mm/dd/yyyy"
            />
          </View>

          <View className="gap-sm">
            <Text className="text-textPrimary font-normal text-lg tracking-tight">
              Expiry Date
            </Text>
            <DatePickerField
              value={cardDetail.expiryDate}
              onChange={setCardExpiryDate}
              placeholder="mm/dd/yyyy"
            />
          </View>

          <View className="gap-sm">
            <Text className="text-textPrimary font-normal text-lg pr-lg tracking-tight">
              Unique marks & traits
            </Text>

            <PostFormTextArea
              value={cardDetail.aiDescription ?? ""}
              onChange={setCardAiDescription}
            />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default BankCardForm;
