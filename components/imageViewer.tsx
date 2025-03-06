import { StyleSheet } from "react-native";
import { Image } from "expo-image";

type Props = {
    imgSource: string;
}

export default function ImageViewer({imgSource}: Props) {
    return <Image source={imgSource} style={styles.image}/>
}

const styles = StyleSheet.create({
    image: {
        width: 160,
        height: 160,
        borderRadius: 100,
    }
})