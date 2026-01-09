import { colors } from "@/src/shared/theme";
import { Target } from "phosphor-react-native";
import { useEffect, useState } from "react";
import { Pressable, Text, TouchableWithoutFeedback, View } from "react-native";

type RadiusControlProps = {
  readonly radius: number;
  readonly onChange: (radius: number) => void;
};

export default function RadiusControl({ radius, onChange }: RadiusControlProps) {
  const [open, setOpen] = useState(false);
  const [localRadius, setLocalRadius] = useState(radius);

  useEffect(() => {
    setLocalRadius(radius);
  }, [radius]);

  const handleApply = () => {
    setOpen(false);
    onChange(localRadius);
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        className="h-14 w-14 bg-white rounded-2xl items-center justify-center"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <Target size={24} color={colors.slate[700]} weight="bold" />
      </Pressable>

      {open ? (
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View
            style={{
              position: "absolute",
              bottom: 70,
              right: 0,
              backgroundColor: "white",
              borderRadius: 16,
              padding: 16,
              minWidth: 250,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <TouchableWithoutFeedback>
              <View>
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-base font-semibold text-gray-900">
                    Search radius
                  </Text>

                  <View className="px-3 py-1 rounded-full bg-gray-100">
                    <Text className="text-sm font-semibold text-gray-900">
                      {localRadius} km
                    </Text>
                  </View>
                </View>

                {/* Quick picks */}
                <View className="flex-row gap-2 mb-3">
                  {[1, 3, 5, 10].map((v) => {
                    const active = localRadius === v;
                    return (
                      <Pressable
                        key={v}
                        onPress={() => setLocalRadius(v)}
                        className={[
                          "px-3 py-2 rounded-xl flex-1 items-center",
                          active ? "bg-gray-900" : "bg-white border border-gray-200",
                        ].join(" ")}
                      >
                        <Text
                          className={
                            active
                              ? "text-white text-xs font-semibold"
                              : "text-gray-900 text-xs font-semibold"
                          }
                        >
                          {v} km
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                {/* Actions */}
                <View className="flex-row gap-2">
                  <Pressable
                    onPress={() => setOpen(false)}
                    className="flex-1 px-4 py-3 rounded-xl bg-gray-100"
                  >
                    <Text className="text-gray-900 font-semibold text-center">
                      Cancel
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={handleApply}
                    className="flex-1 px-4 py-3 rounded-xl bg-blue-600"
                  >
                    <Text className="text-white font-semibold text-center">
                      Apply
                    </Text>
                  </Pressable>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      ) : null}
    </>
  );
}
