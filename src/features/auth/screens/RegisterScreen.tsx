import { useRegister } from "@/src/features/auth/hooks";
import { type RegisterRequest } from "@/src/features/auth/types";
import {
  AppButton,
  BaseInputField,
  PasswordField,
} from "@/src/shared/components";
import { AUTH_ROUTE } from "@/src/shared/constants";
import { colors, typography } from "@/src/shared/theme";
import { yupResolver } from "@hookform/resolvers/yup";
import { router, useLocalSearchParams } from "expo-router";
import { CheckCircleIcon, CircleIcon, LockIcon } from "phosphor-react-native";
import React, { useMemo } from "react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import * as yup from "yup";

const passwordSchema = yup
  .string()
  .trim()
  .min(8, "Password must be at least 8 characters!")
  .matches(/\d/, "Password must contain at least 1 number!")
  .matches(
    /[!@#$%^&*(),.?":{}|<>]/,
    "Password must contain at least 1 special character!",
  )
  .required("Password is required!");

const registerFormSchema = yup
  .object({
    firstName: yup
      .string()
      .trim()
      .min(2, "First name must contain at least 2 characters.")
      .required("First name is required."),
    lastName: yup
      .string()
      .trim()
      .min(2, "Last name must contain at least 2 characters.")
      .required("Last name is required."),
    password: passwordSchema,
  })
  .required();

type RegisterFormSchema = yup.InferType<typeof registerFormSchema>;

const passwordChecklist = [
  {
    id: "minLength",
    label: "Minimum 8 characters",
    test: (v: string) => v.length >= 8,
  },
  {
    id: "hasNumber",
    label: "At least one number",
    test: (v: string) => /\d/.test(v),
  },
  {
    id: "hasSpecial",
    label: "At least one special character",
    test: (v: string) => /[!@#$%^&*(),.?":{}|<>]/.test(v),
  },
];

const RegisterScreen = () => {
  const { email: emailParam } = useLocalSearchParams<{ email?: string }>();
  const { register, loading, error: registerError, reset } = useRegister();

  const email = useMemo(() => {
    if (Array.isArray(emailParam)) return emailParam[0]?.trim() ?? "";
    return emailParam?.trim() ?? "";
  }, [emailParam]);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormSchema>({
    defaultValues: {
      firstName: "",
      lastName: "",
      password: "",
    },
    resolver: yupResolver(registerFormSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const firstNameValue = watch("firstName");
  const lastNameValue = watch("lastName");
  const passwordValue = watch("password");

  const isSubmitting = loading;

  const isFormReady = useMemo(() => {
    const hasFirstName = firstNameValue.trim().length > 0;
    const hasLastName = lastNameValue.trim().length > 0;
    const hasPassword = passwordValue.trim().length > 0;
    const hasEmail = email.length > 0;

    return (
      hasFirstName && hasLastName && hasPassword && hasEmail && !isSubmitting
    );
  }, [email, firstNameValue, isSubmitting, lastNameValue, passwordValue]);

  const onSubmit: SubmitHandler<RegisterFormSchema> = async (data) => {
    if (!email) return;

    try {
      const req: RegisterRequest = {
        email,
        password: data.password,
      };

      await register(req);

      router.push({
        pathname: AUTH_ROUTE.verifyEmail,
        params: { email },
      });
    } catch {
      // Errors are surfaced via hook state.
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-surface"
      contentContainerClassName="p-lg gap-lg"
      automaticallyAdjustKeyboardInsets={true}
      keyboardShouldPersistTaps="handled"
    >
      {/* Legal name */}
      <View className="gap-md2">
        <Text className="text-base font-normal text-on-surface">
          Legal name
        </Text>

        <Controller
          control={control}
          name="firstName"
          render={({ field: { onChange, onBlur, value } }) => (
            <BaseInputField
              label="First name"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={errors.firstName?.message}
              autoComplete="name"
              textContentType="givenName"
              autoCapitalize="words"
            />
          )}
        />

        <Controller
          control={control}
          name="lastName"
          render={({ field: { onChange, onBlur, value } }) => (
            <BaseInputField
              label="Last name"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={errors.lastName?.message}
              autoComplete="name"
              textContentType="familyName"
              autoCapitalize="words"
            />
          )}
        />

        <Text className="text-xs font-normal text-textMuted">
          Make sure it matches the name on your government ID. If you go by a
          different name, you can update it.
        </Text>
      </View>

      {/* Password */}
      <View className="gap-md2">
        <Text className="text-base font-normal text-on-surface">Password</Text>

        {/* Password field */}
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <PasswordField
              value={value}
              onChange={(text) => {
                if (registerError) reset();
                onChange(text);
              }}
              onBlur={onBlur}
              error={errors.password?.message || registerError}
            />
          )}
        />

        {/* Password requirements */}
        <View className="gap-sm bg-surface">
          {passwordChecklist.map((check) => {
            const met = check.test(passwordValue || "");

            return (
              <View key={check.id} className="flex-row items-center gap-xs">
                {met ? (
                  <CheckCircleIcon
                    weight="fill"
                    size={18}
                    color={colors.status.success}
                  />
                ) : (
                  <CircleIcon size={18} color={colors.hof[300]} />
                )}
                <Text
                  style={{
                    color: met ? colors.status.success : colors.text.secondary,
                    fontSize: typography.fontSize.sm,
                    lineHeight: typography.lineHeight.sm,
                    fontWeight: "400",
                  }}
                >
                  {check.label}
                </Text>
              </View>
            );
          })}

          <View className="flex-row items-center gap-xs pt-xs">
            <LockIcon size={14} weight="fill" color={colors.text.muted} />
            <Text
              style={{
                color: colors.text.muted,
                fontSize: typography.fontSize.xs,
                lineHeight: typography.lineHeight.xs,
                fontWeight: "400",
              }}
            >
              Your information is encrypted and secure.
            </Text>
          </View>
        </View>
      </View>

      {/* Submit Button */}
      <AppButton
        title="Create account"
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
        disabled={!isFormReady}
        variant="secondary"
      />
    </ScrollView>
  );
};

export default RegisterScreen;
