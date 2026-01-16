import BacktrackSlogan from '@/assets/backtrack-slogan.svg';

export function AppSlogan({ width = 100, height = 10 }: Readonly<{ width?: number; height?: number }>) {
  return (
    <BacktrackSlogan width={width} height={height} />
  );
}