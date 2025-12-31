import { Tree } from "@/types/api";
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface TreeDetailsModalProps {
  visible: boolean;
  tree: Tree | null;
  onClose: () => void;
}

export function TreeDetailsModal({
  visible,
  tree,
  onClose,
}: TreeDetailsModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-background dark:bg-background-dark">
        {/* Modal Header */}
        <View className="flex-row justify-between items-center px-4 pt-12 pb-4 border-b border-border dark:border-border-dark">
          <Text className="text-xl font-semibold text-foreground dark:text-foreground-dark">
            Tree Details
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text className="text-2xl text-foreground-secondary dark:text-foreground-dark-secondary">
              ✕
            </Text>
          </TouchableOpacity>
        </View>

        {/* Modal Content */}
        <ScrollView className="flex-1 px-4">
          {/* Tree Image */}
          {tree?.image_url && (
            <View className="mt-4 rounded-xl overflow-hidden">
              <Image
                source={{ uri: tree.image_url }}
                className="w-full aspect-square"
                resizeMode="cover"
              />
            </View>
          )}

          {/* Tree Details */}
          <View className="mt-6">
            <Text className="text-foreground-secondary dark:text-foreground-dark-secondary text-sm">
              Tree ID
            </Text>
            <Text className="text-foreground dark:text-foreground-dark text-lg font-medium mt-1">
              #{tree?.id}
            </Text>
          </View>

          <View className="mt-4">
            <Text className="text-foreground-secondary dark:text-foreground-dark-secondary text-sm">
              Common Name
            </Text>
            <Text className="text-foreground dark:text-foreground-dark text-lg font-medium mt-1">
              {tree?.common_name || "Unknown"}
            </Text>
          </View>

          <View className="mt-4">
            <Text className="text-foreground-secondary dark:text-foreground-dark-secondary text-sm">
              Family
            </Text>
            <Text className="text-foreground dark:text-foreground-dark text-lg font-medium mt-1 italic">
              {tree?.family || "Unknown"}
            </Text>
          </View>

          <View className="mt-4">
            <Text className="text-foreground-secondary dark:text-foreground-dark-secondary text-sm">
              Genus
            </Text>
            <Text className="text-foreground dark:text-foreground-dark text-lg font-medium mt-1 italic">
              {tree?.genus || "Unknown"}
            </Text>
          </View>

          {/* Close Button */}
          <TouchableOpacity
            onPress={onClose}
            className="bg-primary py-4 rounded-xl mt-8 mb-8"
          >
            <Text className="text-white text-center font-semibold text-base">
              Close
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}
