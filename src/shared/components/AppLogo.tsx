import BacktrackLogo from '@/assets/backtrack-logo.svg';

export function AppLogo({ width = 400, height = 60 }: Readonly<{ width?: number; height?: number }>) {
  return (
    <BacktrackLogo width={width} height={height} />
  );
}