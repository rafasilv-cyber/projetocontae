import { Text, View, StyleSheet } from "react-native";
import {Link} from "expo-router";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text>Contaê App</Text>
      <Link href="/sobre" style={styles.button}>
        <Text>Sobre</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#b35151",
  },
  button: {
    fontSize: 20,
    textDecorationLine: "none",
    backgroundColor: "#45008b",
    padding: 10,
    borderRadius: 5,
  },
});
