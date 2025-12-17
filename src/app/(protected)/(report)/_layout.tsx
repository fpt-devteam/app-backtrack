import { Stack } from "expo-router";

export default function ReportStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="create" options={{
        title: "Report Lost Item"
      }} />
    </Stack>
  );
}
