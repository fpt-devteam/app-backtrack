import { AppImage } from "@/src/shared/components";
import { ensureMediaPermission, uploadQRLogo } from "@/src/shared/services";
import { colors } from "@/src/shared/theme/colors";
import { PRESET_LOGOS } from "@/src/features/qr/constants";
import {
  launchImageLibraryAsync,
  type ImagePickerOptions,
  type ImagePickerResult,
} from "expo-image-picker";
import { PlusIcon, ProhibitIcon } from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  View,
} from "react-native";

type LogoSelectorProps = {
  readonly value?: string;
  readonly onChange: (logoUri: string) => void;
  readonly disabled?: boolean;
};

type PresetLogoItemProps = {
  readonly imageUri: string;
  readonly isSelected: boolean;
  readonly disabled: boolean;
  readonly onPress: (imageUri: string) => void;
};

function PresetLogoItem({
  imageUri,
  isSelected,
  disabled,
  onPress,
}: PresetLogoItemProps) {
  return (
    <Pressable
          onPress={() => onPress(imageUri)}
      disabled={disabled}
      className="rounded-xl border overflow-hidden"
      style={{
        borderColor: isSelected ? colors.primary : colors.slate[200],
        borderWidth: isSelected ? 2 : 1,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <AppImage
        source={{ uri: imageUri }}
        style={{ width: 66, height: 66 }}
        resizeMode="cover"
      />
    </Pressable>
  );
}

export function LogoSelector({
  value,
  onChange,
  disabled = false,
}: LogoSelectorProps) {
  const [isSelectingCustomImage, setIsSelectingCustomImage] = useState(false);
  const [customLogoUri, setCustomLogoUri] = useState<string>(value ?? "");

  useEffect(() => {
    if (value) setCustomLogoUri(value);
  }, [value]);

  const handlePickCustomLogo = async () => {
    if (disabled || isSelectingCustomImage) return;

    const hasPermission = await ensureMediaPermission();
    if (!hasPermission) return;

    const options = {
      mediaTypes: ["images"],
      allowsMultipleSelection: false,
      quality: 0.9,
    } as ImagePickerOptions;

    try {
      setIsSelectingCustomImage(true);
      const result: ImagePickerResult = await launchImageLibraryAsync(options);

      if (result.canceled || !result.assets?.length) return;

      const selectedAsset = result.assets[0];
      // Capture previous URI for rollback on upload error
      const prevUri = customLogoUri;
      // Show local preview immediately while uploading
      setCustomLogoUri(selectedAsset.uri);
      try {
        const downloadURL = await uploadQRLogo(selectedAsset.uri);
        onChange(downloadURL);
      } catch (uploadError) {
        const uploadMessage =
          uploadError instanceof Error
            ? uploadError.message
            : "Upload failed";
        console.log("Error uploading QR logo: ", uploadMessage);
        Alert.alert("Upload failed", "Please try again");
        // Rollback preview to the previous value
        setCustomLogoUri(prevUri);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Image selection failed";
      console.log("Error selecting custom logo: ", message);
    } finally {
      setIsSelectingCustomImage(false);
    }
  };

  const isCustomLogoSelected = Boolean(value && value === customLogoUri);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 10, paddingRight: 8 }}
    >
      {/* None / Clear Button */}
      <Pressable
        onPress={() => onChange("")}
        disabled={disabled}
        className="rounded-xl border overflow-hidden items-center justify-center"
        style={{
          width: 66,
          height: 66,
          borderColor: !value ? colors.primary : colors.slate[200],
          borderWidth: !value ? 2 : 1,
          backgroundColor: colors.slate[50],
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <ProhibitIcon
          size={28}
          color={!value ? colors.primary : colors.slate[400]}
        />
      </Pressable>

      {/* Custom Logo Upload Button */}
      <Pressable
        onPress={handlePickCustomLogo}
        disabled={disabled || isSelectingCustomImage}
        className="rounded-xl border overflow-hidden items-center justify-center"
        style={{
          width: 66,
          height: 66,
          borderColor: isCustomLogoSelected
            ? colors.primary
            : colors.slate[200],
          borderWidth: isCustomLogoSelected ? 2 : 1,
          backgroundColor: customLogoUri
            ? colors.slate[100]
            : colors.slate[200],
          opacity: disabled || isSelectingCustomImage ? 0.6 : 1,
        }}
      >
        {customLogoUri ? (
          <Image
            source={{ uri: customLogoUri }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        ) : null}

        <View
          className="absolute items-center justify-center rounded-full"
          style={{
            width: 22,
            height: 22,
            backgroundColor: `${colors.slate[900]}BF`,
          }}
        >
          <PlusIcon size={14} color={colors.white} weight="bold" />
        </View>

        {isSelectingCustomImage && (
          <View
            className="absolute inset-0 items-center justify-center"
            style={{ backgroundColor: `${colors.black}59` }}
          >
            <ActivityIndicator color={colors.white} size="small" />
          </View>
        )}
      </Pressable>

      {/* Preset Logos List */}
      {PRESET_LOGOS.map((imageUri) => {
        const isSelected = value === imageUri;
        return (
          <PresetLogoItem
            key={imageUri}
            imageUri={imageUri}
            isSelected={isSelected}
            disabled={disabled || isSelectingCustomImage}
            onPress={onChange}
          />
        );
      })}
    </ScrollView>
  );
}
