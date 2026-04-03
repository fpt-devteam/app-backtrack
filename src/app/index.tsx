import { POST_ROUTE } from "@/src/shared/constants";
import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href={POST_ROUTE.index} />;
}
