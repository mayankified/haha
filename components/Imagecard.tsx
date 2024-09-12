import { View, Text, TouchableOpacity, Image } from "react-native";
import { Link } from "expo-router"; // Import Link from expo-router
import { icons } from "../constants";

interface ImageCardProps {
  title: string;
  creator: string;
  avatar: string;
  image: string;
  route: string; // Add a prop for the route
}

const ImageCard: React.FC<ImageCardProps> = ({
  title,
  creator,
  avatar,
  image,
  route, // Receive the route as a prop
}) => {
  return (
    <View className="flex flex-col items-center px-4 mb-14">
      <View className="flex flex-row gap-3 items-start">
        <View className="flex justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary border-solid flex justify-center items-center p-0.5">
            <Image
              source={icons.avatar}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text className="font-psemibold line-clamp-2 text-sm text-white">
              {title}
            </Text>
            <Text className="text-xs text-gray-100 font-pregular">
              {creator}
            </Text>
          </View>
        </View>

        <View className="pt-2">
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </View>
      </View>

      {/* Wrap the TouchableOpacity in a Link */}
      <Link href={route as any} asChild>
        <TouchableOpacity
          activeOpacity={0.7}
          className="w-full h-60 rounded-xl mt-3 relative flex justify-center items-center"
        >
          <Image
            source={{ uri: image }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default ImageCard;
