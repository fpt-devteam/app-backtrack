import { useCheckEmailStatus, useRegister } from "@/src/features/auth/hooks";
import { EMAIL_STATUS, type RegisterRequest } from "@/src/features/auth/types";
import { AppInlineError, BottomSheet } from "@/src/shared/components";
import { EmailField } from "@/src/shared/components/fields/EmailField";
import { PasswordField } from "@/src/shared/components/fields/PasswordField";
import { colors } from "@/src/shared/theme";
import { useRouter } from "expo-router";
import {
  ArrowRightIcon,
  CaretLeftIcon,
  CheckCircleIcon,
  CircleIcon,
  EnvelopeSimpleIcon,
  HeartIcon,
  LockIcon,
  UserCheckIcon,
} from "phosphor-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as yup from "yup";

const emailSchema = yup
  .string()
  .trim()
  .email("Invalid email format!")
  .required("Email is required!");

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

type Stepper = "email" | "password" | "verifyEmail";

const stepperToIndex: Record<Stepper, number> = {
  email: 0,
  password: 1,
  verifyEmail: 2,
};

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

const SignUpScreen = () => {
  const { register, loading, error } = useRegister();
  const { checkEmailStatus } = useCheckEmailStatus();

  const router = useRouter();
  const [currentStepper, setCurrentStepper] = useState<Stepper>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [sheetVisible, setSheetVisible] = useState(false);
  const [resendSheetVisible, setResendSheetVisible] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    if (!resendSheetVisible) setResendCountdown(0);
  }, [resendSheetVisible]);

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setTimeout(() => setResendCountdown((p) => p - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const handleResendEmail = () => {
    setResendCountdown(59);
    // TODO: Call resend verification email API
  };

  const currentStepIndex = stepperToIndex[currentStepper];

  const validateEmail = async (value: string) => {
    try {
      await emailSchema.validate(value);
      setEmailError(undefined);
      return true;
    } catch (e) {
      if (e instanceof yup.ValidationError) setEmailError(e.message);
      return false;
    }
  };

  const validatePassword = async (value: string) => {
    try {
      await passwordSchema.validate(value);
      setPasswordError(undefined);
      return true;
    } catch (e) {
      if (e instanceof yup.ValidationError) setPasswordError(e.message);
      return false;
    }
  };

  const handleEmailNext = async () => {
    const isValid = await validateEmail(email);
    if (!isValid) return;

    const emailStatusResponse = await checkEmailStatus({ email });
    const { status } = emailStatusResponse;

    if (status === EMAIL_STATUS.NOT_FOUND) {
      setCurrentStepper("password");
      return;
    }

    setSheetVisible(true);
  };

  const handlePasswordNext = async () => {
    const isValid = await validatePassword(password);
    if (!isValid) return;

    try {
      const req: RegisterRequest = { email, password };
      await register(req);
      setCurrentStepper("verifyEmail");
    } catch {
      // error surfaced via `error` from useRegister
    }
  };

  const handleOpenEmailApp = () => {
    Linking.openURL("mailto:");
  };

  const handleGoBack = () => {
    if (currentStepper === "email") router.push("/login");
    if (currentStepper === "password") setCurrentStepper("email");
    if (currentStepper === "verifyEmail") setCurrentStepper("password");
  };

  return (
    <>
      <View className="flex-1 bg-white">
        {/* Top Bar: Back + Progress */}
        <View className="flex-row items-center gap-3 pr-6">
          <TouchableOpacity onPress={handleGoBack} hitSlop={12}>
            <CaretLeftIcon size={24} color={colors.text.main} />
          </TouchableOpacity>

          <View className="flex-1 flex-row gap-1.5">
            {[0, 1, 2].map((i) => (
              <View
                key={i}
                className="flex-1 rounded-full"
                style={{
                  height: 4,
                  backgroundColor:
                    i <= currentStepIndex ? colors.primary : colors.slate[200],
                }}
              />
            ))}
          </View>
        </View>

        {/* Step Content */}
        <View className="flex-1 pt-8">
          {/*  Create Email Step */}
          {currentStepper === "email" && (
            <>
              <Text
                className="text-2xl font-bold mb-1"
                style={{ color: colors.text.main }}
              >
                {"What's your email?"}
              </Text>
              <Text className="text-sm mb-8" style={{ color: colors.text.sub }}>
                {"We'll send you a verification code to get you started."}
              </Text>

              <EmailField
                value={email}
                onChange={setEmail}
                onBlur={() => validateEmail(email)}
                error={emailError}
              />

              <View className="flex-row gap-2 items-center mt-3">
                <LockIcon weight="fill" size={14} color={colors.slate[500]} />
                <Text className="text-sm" style={{ color: colors.text.sub }}>
                  Your email is safe with us
                </Text>
              </View>
            </>
          )}

          {/*  Create Password Step */}
          {currentStepper === "password" && (
            <>
              <Text
                className="text-2xl font-bold mb-1"
                style={{ color: colors.text.main }}
              >
                Create a password
              </Text>
              <Text className="text-sm mb-8" style={{ color: colors.text.sub }}>
                Ensure your account is secure with a strong password.
              </Text>

              {error && <AppInlineError message={error} />}

              <PasswordField
                value={password}
                onChange={setPassword}
                onBlur={() => validatePassword(password)}
                error={passwordError}
              />

              {/* Password checklist — updates in real-time */}
              <View className="mt-4 gap-2.5">
                {passwordChecklist.map((check) => {
                  const met = check.test(password);
                  return (
                    <View
                      key={check.id}
                      className="flex-row items-center gap-2"
                    >
                      {met ? (
                        <CheckCircleIcon
                          weight="fill"
                          size={18}
                          color={colors.status.success}
                        />
                      ) : (
                        <CircleIcon size={18} color={colors.slate[300]} />
                      )}
                      <Text
                        className="text-sm"
                        style={{
                          color: met ? colors.status.success : colors.text.sub,
                        }}
                      >
                        {check.label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </>
          )}

          {/* Verify Email Step */}
          {currentStepper === "verifyEmail" && (
            <View className="flex-1 items-center justify-center gap-6 pb-10">
              {/* Envelope illustration */}
              <View className="relative">
                <View
                  className="items-center justify-center rounded-3xl"
                  style={{
                    width: 120,
                    height: 120,
                    backgroundColor: "#a8d5cf",
                  }}
                >
                  <EnvelopeSimpleIcon weight="fill" size={60} color="#ffffff" />
                </View>
                {/* Heart badge */}
                <View
                  className="absolute items-center justify-center rounded-xl"
                  style={{
                    top: -10,
                    right: -10,
                    width: 36,
                    height: 36,
                    backgroundColor: colors.primary,
                  }}
                >
                  <HeartIcon weight="fill" size={18} color="#ffffff" />
                </View>
              </View>

              {/* Text content */}
              <View className="items-center gap-2 px-4">
                <Text
                  className="text-2xl font-bold text-center"
                  style={{ color: colors.text.main }}
                >
                  Verify your email
                </Text>
                <Text
                  className="text-sm text-center leading-5"
                  style={{ color: colors.text.sub }}
                >
                  {"We've sent a verification link to "}
                  <Text
                    className="font-semibold"
                    style={{ color: colors.text.main }}
                  >
                    {email}
                  </Text>
                  {". Please click the link to secure your account."}
                </Text>
              </View>

              {/* Actions */}
              <View className="w-full gap-3">
                <TouchableOpacity
                  onPress={handleOpenEmailApp}
                  className="h-14 items-center justify-center rounded-full bg-primary"
                  activeOpacity={0.8}
                >
                  <Text
                    className="text-base font-semibold"
                    style={{ color: colors.primaryForeground }}
                  >
                    Open Email App
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setResendSheetVisible(true)}
                  className="h-12 items-center justify-center"
                  activeOpacity={0.6}
                >
                  <Text
                    className="text-sm font-medium"
                    style={{ color: colors.text.main }}
                  >
                    I didn&#39;t get an email
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Next Button  */}
        {currentStepper !== "verifyEmail" && (
          <View className="pb-10">
            <TouchableOpacity
              onPress={
                currentStepper === "email"
                  ? handleEmailNext
                  : handlePasswordNext
              }
              disabled={loading}
              className={`h-14 flex-row items-center justify-center rounded-full bg-primary gap-2 ${
                loading ? "opacity-70" : ""
              }`}
              activeOpacity={0.8}
            >
              {loading && currentStepper === "password" ? (
                <>
                  <ActivityIndicator color="#ffffff" size="small" />
                  <Text
                    className="text-base font-semibold"
                    style={{ color: colors.primaryForeground }}
                  >
                    Creating Account...
                  </Text>
                </>
              ) : (
                <>
                  <Text
                    className="text-base font-semibold"
                    style={{ color: colors.primaryForeground }}
                  >
                    Next
                  </Text>
                  <ArrowRightIcon
                    size={18}
                    color={colors.primaryForeground}
                    weight="bold"
                  />
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* BottomSheet: Account already exists */}
      <View
        style={{ position: "absolute", inset: 0, zIndex: 30 }}
        pointerEvents="box-none"
      >
        <BottomSheet
          isVisible={sheetVisible}
          onClose={() => setSheetVisible(false)}
        >
          <View className="items-center py-6 px-12 gap-5">
            {/* Icon */}
            <View
              className="items-center justify-center rounded-full"
              style={{
                width: 64,
                height: 64,
                backgroundColor: colors.sky[50] ?? "#f0f9ff",
              }}
            >
              <UserCheckIcon weight="fill" size={30} color={colors.primary} />
            </View>

            {/* Text */}
            <View className="items-center gap-2">
              <Text
                className="text-xl font-bold text-center"
                style={{ color: colors.text.main }}
              >
                Account already exists
              </Text>
              <Text
                className="text-sm text-center leading-5"
                style={{ color: colors.text.sub }}
              >
                {"It looks like you've already signed up with "}
                <Text
                  className="font-semibold"
                  style={{ color: colors.text.main }}
                >
                  {email}
                </Text>
                {". Would you like to log in instead?"}
              </Text>
            </View>

            {/* Actions */}
            <View className="w-full gap-3">
              {/* Login Button */}
              <TouchableOpacity
                onPress={() => {
                  router.push("/login");
                }}
                className="h-14 items-center justify-center rounded-full bg-primary"
                activeOpacity={0.8}
              >
                <Text
                  className="text-base font-semibold"
                  style={{ color: colors.primaryForeground }}
                >
                  Log In
                </Text>
              </TouchableOpacity>

              {/* Cancel Button */}
              <TouchableOpacity
                onPress={() => {
                  console.log(
                    "User opts to stay on Sign Up screen and change email",
                  );
                  setSheetVisible(false);
                }}
                className="h-12 items-center justify-center"
                activeOpacity={0.6}
              >
                <Text
                  className="text-sm font-medium"
                  style={{ color: colors.text.sub }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheet>
      </View>

      {/* BottomSheet: I didn't get an email */}
      <View
        style={{ position: "absolute", inset: 0, zIndex: 30 }}
        pointerEvents="box-none"
      >
        <BottomSheet
          isVisible={resendSheetVisible}
          onClose={() => setResendSheetVisible(false)}
        >
          <View className="items-center py-6 px-12 gap-5">
            {/* Icon */}
            <View
              className="items-center justify-center rounded-full"
              style={{
                width: 64,
                height: 64,
                backgroundColor: colors.sky[50] ?? "#f0f9ff",
              }}
            >
              <EnvelopeSimpleIcon
                weight="fill"
                size={30}
                color={colors.primary}
              />
            </View>

            {/* Text */}
            <View className="items-center gap-2">
              <Text
                className="text-xl font-bold text-center"
                style={{ color: colors.text.main }}
              >
                I didn&#39;t get an email
              </Text>
              <Text
                className="text-sm text-center leading-5"
                style={{ color: colors.text.sub }}
              >
                Check your spam folder or try resending the link.
              </Text>
            </View>

            {/* Actions */}
            <View className="w-full gap-2">
              <TouchableOpacity
                onPress={handleResendEmail}
                disabled={resendCountdown > 0}
                className={`h-14 items-center justify-center rounded-full bg-primary ${
                  resendCountdown > 0 ? "opacity-60" : ""
                }`}
                activeOpacity={0.8}
              >
                <Text
                  className="text-base font-semibold"
                  style={{ color: colors.primaryForeground }}
                >
                  Resend Verification Email
                </Text>
              </TouchableOpacity>

              {resendCountdown > 0 && (
                <Text
                  className="text-sm text-center"
                  style={{ color: colors.text.sub }}
                >
                  {`Resend again in 0:${String(resendCountdown).padStart(2, "0")}`}
                </Text>
              )}

              <TouchableOpacity
                onPress={() => setResendSheetVisible(false)}
                className="h-12 items-center justify-center"
                activeOpacity={0.6}
              >
                <Text
                  className="text-sm font-medium"
                  style={{ color: colors.text.main }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheet>
      </View>
    </>
  );
};

export default SignUpScreen;
