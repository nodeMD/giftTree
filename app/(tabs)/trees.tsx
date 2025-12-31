import { useAuth } from "@/contexts/AuthContext";
import { fetchTreeData } from "@/services/api";
import useFetch from "@/services/useFetch";
import { Tree, TreesApiResponse } from "@/types/api";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function TreesScreen() {
  const { user } = useAuth();
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { data, loading, error } = useFetch<TreesApiResponse>(
    () => fetchTreeData("tree", user?.completedGoals || 0),
    (user?.completedGoals || 0) > 0, // Only fetch if completedGoals > 0
  );

  const handleTreePress = (tree: Tree) => {
    setSelectedTree(tree);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedTree(null);
  };
  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      {/* Header */}
      <View className="px-4 pt-12 pb-4">
        <Text className="text-xl font-semibold text-foreground dark:text-foreground-dark text-center">
          Trees planted by you
        </Text>
      </View>

      {/* Content */}
      {loading && <ActivityIndicator size="large" color="#16A34A" />}
      {error && (
        <Text className="text-danger px-4 text-center">
          Error: {error.message}
        </Text>
      )}
      {!data ? (
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-6xl mb-4">🌲</Text>
          <Text className="text-foreground-secondary dark:text-foreground-dark-secondary text-center">
            No trees planted yet, keep clicking!
          </Text>
        </View>
      ) : (
        <ScrollView className="flex-1 px-4">
          {/* Success Information */}
          <Text className="text-foreground-secondary dark:text-foreground-dark-secondary text-center font-medium">
            You planted {data?.data.length}{" "}
            {data?.data.length === 1 ? "tree" : "trees"}. Hooray!
          </Text>

          {/* Tree List */}
          {data?.data.map((tree) => (
            <TouchableOpacity
              key={tree.id}
              onPress={() => handleTreePress(tree)}
              className="flex-row items-center py-3 border-b border-border dark:border-border-dark"
            >
              <View className="w-10 h-10 bg-primary-100 dark:bg-primary-400 rounded-full items-center justify-center mr-3">
                <Text className="text-lg">🌲</Text>
              </View>
              <View>
                <Text className="text-foreground dark:text-foreground-dark font-medium">
                  {tree.common_name}
                </Text>
                <Text className="text-foreground-secondary dark:text-foreground-dark-secondary text-sm">
                  {tree.status}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Ad Banner Placeholder */}
      <View className="h-16 bg-background-secondary dark:bg-background-dark-secondary items-center justify-center">
        <Text className="text-foreground-muted dark:text-foreground-dark-muted text-sm">
          Ad Banner Placeholder
        </Text>
      </View>

      {/* Tree Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View className="flex-1 bg-background dark:bg-background-dark">
          {/* Modal Header */}
          <View className="flex-row justify-between items-center px-4 pt-12 pb-4 border-b border-border dark:border-border-dark">
            <Text className="text-xl font-semibold text-foreground dark:text-foreground-dark">
              Tree Details
            </Text>
            <TouchableOpacity onPress={closeModal}>
              <Text className="text-2xl text-foreground-secondary dark:text-foreground-dark-secondary">
                ✕
              </Text>
            </TouchableOpacity>
          </View>

          {/* Modal Content */}
          <ScrollView className="flex-1 px-4">
            {/* Tree Image */}
            {selectedTree?.image_url && (
              <View className="mt-4 rounded-xl overflow-hidden">
                <Image
                  source={{ uri: selectedTree.image_url }}
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
                #{selectedTree?.id}
              </Text>
            </View>

            <View className="mt-4">
              <Text className="text-foreground-secondary dark:text-foreground-dark-secondary text-sm">
                Common Name
              </Text>
              <Text className="text-foreground dark:text-foreground-dark text-lg font-medium mt-1">
                {selectedTree?.common_name || "Unknown"}
              </Text>
            </View>

            <View className="mt-4">
              <Text className="text-foreground-secondary dark:text-foreground-dark-secondary text-sm">
                Family
              </Text>
              <Text className="text-foreground dark:text-foreground-dark text-lg font-medium mt-1 italic">
                {selectedTree?.family || "Unknown"}
              </Text>
            </View>

            <View className="mt-4">
              <Text className="text-foreground-secondary dark:text-foreground-dark-secondary text-sm">
                Genus
              </Text>
              <Text className="text-foreground dark:text-foreground-dark text-lg font-medium mt-1 italic">
                {selectedTree?.genus || "Unknown"}
              </Text>
            </View>

            {/* Close Button */}
            <TouchableOpacity
              onPress={closeModal}
              className="bg-primary py-4 rounded-xl mt-8 mb-8"
            >
              <Text className="text-white text-center font-semibold text-base">
                Close
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
