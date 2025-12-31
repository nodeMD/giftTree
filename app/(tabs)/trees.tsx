import { AdBanner } from "@/components/AdBanner";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { TreeDetailsModal } from "@/components/TreeDetailsModal";
import { useAuth } from "@/contexts/AuthContext";
import useFetch from "@/hooks/useFetch";
import { fetchTreeData } from "@/services/api";
import { Tree, TreesApiResponse } from "@/types/api";
import { useCallback, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function TreesScreen() {
  const { user } = useAuth();
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchFn = useCallback(
    () => fetchTreeData("tree", user?.completedGoals || 0),
    [user?.completedGoals],
  );
  const { data, loading, error } = useFetch<TreesApiResponse>(
    fetchFn,
    (user?.completedGoals || 0) > 0,
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
      {loading && <LoadingIndicator />}
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
      <AdBanner />

      <TreeDetailsModal
        visible={modalVisible}
        tree={selectedTree}
        onClose={closeModal}
      />
    </View>
  );
}
