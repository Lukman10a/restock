import { View } from "react-native";

// Placeholder tab route so the Tabs layout recognizes `export_tab`.
// Actual navigation is handled by the tab press listener which redirects
// to the standalone `/export` modal route.
export default function ExportTabPlaceholder() {
  return <View />;
}
