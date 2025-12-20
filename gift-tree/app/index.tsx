import { Image, View } from "react-native";
import { images } from "@/constants/images";

export default function Index() {
  return (
    <View className="flex-1">
      <Image
        className="justify-center object-cover object-center rounded-full h-48 w-48"
        source={images.icon}
      />
    </View>
  );
}
