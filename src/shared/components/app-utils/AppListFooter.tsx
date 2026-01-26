import { AppEndOfFeed } from "@/src/shared/components/app-utils/AppEndOfFeed";
import { AppLoader } from "@/src/shared/components/app-utils/AppLoader";

interface AppListFooterProps {
  isFetchingNextPage: boolean
  hasNextPage: boolean
}

export const AppListFooter = ({ isFetchingNextPage, hasNextPage }: AppListFooterProps) => {
  if (isFetchingNextPage) {
    return <AppLoader />;
  }
  if (!hasNextPage) {
    return <AppEndOfFeed />;
  }
  return null;
} 