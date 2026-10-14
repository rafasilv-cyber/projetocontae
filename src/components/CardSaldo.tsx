import { StyleSheet, Text, View } from 'react-native';

interface CardSaldoProps {
  titulo: string;
  valor: string | number;
  corFundo: string;
}

export default function CardSaldo({ titulo, valor, corFundo }: CardSaldoProps) {
  return (
    <View style={[styles.card, { backgroundColor: corFundo }]}>
      <Text style={styles.label}>{titulo}</Text>
      <Text style={styles.valor}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    flex: 1,
    margin: 10,
    borderRadius: 10,
  },
  label: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  valor: {
    color: '#bbb',
    fontSize: 22,
    fontWeight: 'bold',
  },
});
