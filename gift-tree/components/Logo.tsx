import { images } from "@/constants/images";
import React from "react";
import { Image, View } from "react-native";

const Logo = () => {
  return (
    <View className="items-center mb-8">
      <View className="w-32 h-32 items-center justify-center mb-2">
        <Image source={images.logo} className="w-full h-full"></Image>
      </View>
    </View>
  );
};

export default Logo;
