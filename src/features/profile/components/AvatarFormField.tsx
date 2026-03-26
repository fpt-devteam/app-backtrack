import { useAppUser } from "@/src/features/auth/providers";
import { usePatchProfile } from "@/src/features/profile/hooks";
import { AppUserAvatar } from "@/src/shared/components";
import { toast } from "@/src/shared/components/ui/toast";
import { useUploadImage } from "@/src/shared/hooks";
import { ensureMediaPermission } from "@/src/shared/services";
import {
  launchImageLibraryAsync,
  UIImagePickerPresentationStyle,
} from "expo-image-picker";
import { CameraIcon } from "phosphor-react-native";
import React, { useState } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";

export const AvatarFormField = () => {
  const { user: profile, refetch } = useAppUser();
  const { uploadImages } = useUploadImage();
  const { patchProfile } = usePatchProfile();

  const [isUpdating, setIsUpdating] = useState(false);

  const handlePickAvatar = async () => {
    const hasPermission = await ensureMediaPermission();
    if (!hasPermission) return;

    const result = await launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      presentationStyle: UIImagePickerPresentationStyle.AUTOMATIC,
    });

    if (result.canceled || !result.assets[0]) return;

    try {
      setIsUpdating(true);

      const uploadRes = await uploadImages([result.assets[0]]);
      if (!uploadRes || uploadRes.length === 0) {
        toast.error("Upload failed. Please try again.");
        return;
      }

      const newAvatarUrl = uploadRes[0].downloadURL;
      await patchProfile({ avatarUrl: newAvatarUrl });
      await refetch();
      toast.success("Avatar updated successfully!");
    } catch (error) {
      console.error("Avatar update error:", error);
      toast.error("An error occurred while updating your profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <View className="items-center justify-center py-6">
      <View className="relative">
        {/* Avatar Container */}
        <View className="rounded-full border-4 border-white shadow-sm overflow-hidden bg-slate-100">
          <AppUserAvatar size={128} avatarUrl={profile?.avatarUrl} />

          {/* Loading Overlay */}
          {isUpdating && (
            <View className="absolute inset-0 bg-black/40 items-center justify-center">
              <ActivityIndicator color="white" />
            </View>
          )}
        </View>

        {/* Camera Badge Button */}
        <Pressable
          onPress={handlePickAvatar}
          disabled={isUpdating}
          className="absolute bottom-0 right-0 bg-primary w-10 h-10 rounded-full items-center justify-center border-2 border-white shadow-lg active:scale-90"
        >
          <CameraIcon size={22} color="white" weight="bold" />
        </Pressable>
      </View>
    </View>
  );
};
