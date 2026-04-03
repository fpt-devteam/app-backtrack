import { useRegister } from "@/src/features/auth/hooks";
import { type RegisterRequest } from "@/src/features/auth/types";
import { AppButton, BaseInputField, PasswordField } from "@/src/shared/components";
import { AUTH_ROUTE } from "@/src/shared/constants";
import { colors, metrics, typography } from "@/src/shared/theme";
import { yupResolver } from "@hookform/resolvers/yup";
import { router, useLocalSearchParams } from "expo-router";
import { CheckCircleIcon, CircleIcon, LockIcon } from "phosphor-react-native";
import React, { useMemo } from "react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
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
    phone: yup
      .string()
      .trim()
      .matches(/^[0-9+()\-\s]{7,20}$/, {
        message: "Phone format is invalid.",
        excludeEmptyString: true,
      })
      .required("Phone number is required."),
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
  const { register, loading } = useRegister();

  const email = useMemo(() => {
    if (Array.isArray(emailParam)) return emailParam[0]?.trim() ?? "";
    return emailParam?.trim() ?? "";
  }, [emailParam]);

  const {
    control,
    handleSubmit,
    trigger,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<RegisterFormSchema>({
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      password: "",
    },
    resolver: yupResolver(registerFormSchema),
    mode: "onSubmit",
  });

  const firstNameValue = watch("firstName");
  const lastNameValue = watch("lastName");
  const phoneValue = watch("phone");
  const passwordValue = watch("password");

  const isSubmitting = loading;

  const isFormReady = useMemo(() => {
    const hasFirstName = firstNameValue.trim().length > 0;
    const hasLastName = lastNameValue.trim().length > 0;
    const hasPhone = phoneValue.trim().length > 0;
    const hasPassword = passwordValue.trim().length > 0;
    const hasEmail = email.length > 0;

    return (
      hasFirstName &&
      hasLastName &&
      hasPhone &&
      hasPassword &&
      hasEmail &&
      !isSubmitting
    );
  }, [
    email,
    firstNameValue,
    isSubmitting,
    lastNameValue,
    passwordValue,
    phoneValue,
  ]);

  const handleFieldChange = (field: keyof RegisterFormSchema) => {
    if (errors[field]) {
      clearErrors(field);
    }
  };

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
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          className="flex-1 bg-surface py-2"
          style={{
            paddingHorizontal: metrics.spacing.lg,
            paddingVertical: metrics.spacing.lg,
          }}
        >
          <View className="w-full max-w-screen-sm gap-lg py-4">
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
                    onChange={(text) => {
                      handleFieldChange("firstName");
                      onChange(text);
                    }}
                    onBlur={() => {
                      onBlur();
                      void trigger("firstName");
                    }}
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
                    onChange={(text) => {
                      handleFieldChange("lastName");
                      onChange(text);
                    }}
                    onBlur={() => {
                      onBlur();
                      void trigger("lastName");
                    }}
                    error={errors.lastName?.message}
                    autoComplete="name"
                    textContentType="familyName"
                    autoCapitalize="words"
                  />
                )}
              />
              <Text className="text-xs font-normal text-textMuted">
                Make sure it matches the name on your government ID. If you go
                by a different name, you can update it.
              </Text>
            </View>

            <View className="gap-md2">
              <Text className="text-base font-normal text-on-surface">
                Phone
              </Text>
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <BaseInputField
                    label="Phone number"
                    value={value}
                    onChange={(text) => {
                      handleFieldChange("phone");
                      onChange(text);
                    }}
                    onBlur={() => {
                      onBlur();
                      void trigger("phone");
                    }}
                    error={errors.phone?.message}
                    keyboardType="phone-pad"
                    autoComplete="tel"
                    textContentType="telephoneNumber"
                    autoCapitalize="none"
                  />
                )}
              />
            </View>

            <View className="gap-md2">
              <Text className="text-base font-normal text-on-surface">
                Password
              </Text>

              {/* Password field */}
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <PasswordField
                    value={value}
                    onChange={(text) => {
                      handleFieldChange("password");
                      onChange(text);
                    }}
                    onBlur={() => {
                      onBlur();
                      void trigger("password");
                    }}
                    error={errors.password?.message}
                  />
                )}
              />

              {/* Password requirements */}
              <View className="gap-sm bg-surface">
                {passwordChecklist.map((check) => {
                  const met = check.test(passwordValue || "");

                  return (
                    <View
                      key={check.id}
                      className="flex-row items-center gap-xs"
                    >
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
                          color: met
                            ? colors.status.success
                            : colors.text.secondary,
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

            <AppButton
              title="Create account"
              onPress={handleSubmit(onSubmit)}
              loading={isSubmitting}
              disabled={!isFormReady}
              variant="secondary"
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
