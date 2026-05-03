import {
  PostFormField,
  PostFormTextArea,
} from "@/src/features/post/components";
import { usePostCreationStore } from "@/src/features/post/hooks";
import { DatePickerField } from "@/src/shared/components";
import React from "react";
import { Text, View } from "react-native";

const IdentificationCardForm = () => {
  const cardDetail = usePostCreationStore((state) => state.cardDetail);
  const setCardNumberMasked = usePostCreationStore(
    (state) => state.setCardNumberMasked,
  );
  const setCardHolderName = usePostCreationStore(
    (state) => state.setCardHolderName,
  );
  const setCardDateOfBirth = usePostCreationStore(
    (state) => state.setCardDateOfBirth,
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
    <View className="flex-1 gap-md">
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
          label="ID Number"
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
          label="Issuing Authority"
          value={cardDetail.issuingAuthority ?? ""}
          onChange={setCardIssuingAuthority}
        />
      </View>

      <View className="border rounded-md overflow-hidden">
        <View className="p-md2 gap-sm">
          <Text className="text-textPrimary font-normal text-lg tracking-tight">
            Date of Birth
          </Text>
          <DatePickerField
            value={cardDetail.dateOfBirth}
            onChange={setCardDateOfBirth}
            placeholder="mm/dd/yyyy"
          />
        </View>

        <View className="border-t" />

        <View className="p-md2 gap-sm">
          <Text className="text-textPrimary font-normal text-lg tracking-tight">
            Issue Date
          </Text>
          <DatePickerField
            value={cardDetail.issueDate}
            onChange={setCardIssueDate}
            placeholder="mm/dd/yyyy"
          />
        </View>

        <View className="border-t" />

        <View className="p-md2 gap-sm">
          <Text className="text-textPrimary font-normal text-lg tracking-tight">
            Expiry Date
          </Text>
          <DatePickerField
            value={cardDetail.expiryDate}
            onChange={setCardExpiryDate}
            placeholder="mm/dd/yyyy"
          />
        </View>
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
    </View>
  );
};

export default IdentificationCardForm;
