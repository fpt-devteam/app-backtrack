import GoogleLogo from "@/assets/google-logo.svg";

export function AppGoogleLogo({
  width = 20,
  height = 20,
}: Readonly<{ width?: number; height?: number }>) {
  return <GoogleLogo width={width} height={height} />;
}
