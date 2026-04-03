import React from "react";
import { LayoutAnimation, Pressable, View } from "react-native";

interface AccordionProps {
  isExpanded: boolean;
  onToggle: () => void;
  collapsedContent: React.ReactNode;
  expandedContent: React.ReactNode;
}

export const AppAccordion = ({
  isExpanded,
  onToggle,
  collapsedContent,
  expandedContent,
}: AccordionProps) => {
  const handleToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onToggle();
  };

  return (
    <View>
      <Pressable onPress={handleToggle}>{collapsedContent}</Pressable>
      {isExpanded && expandedContent}
    </View>
  );
};
