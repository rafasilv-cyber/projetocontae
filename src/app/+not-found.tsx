import {Link, Stack} from "expo-router";
import { Text, View, StyleSheet } from "react-native";

export default function NotFoundScreen() {
  return (
<>
    <Stack.Screen options={{ title: "Oops!" }} />
    <View style={styles.container}>
      <Text>Page Not Found!</Text>
      <Link href="/" style={styles.button}>
        <Text>Go Home</Text>
      </Link>
    </View>
</>
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
