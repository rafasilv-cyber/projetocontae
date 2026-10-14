import CardSaldo from '@/components/CardSaldo';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

interface Transacao {
  id: number;
  descricao: string;
  valor: string | number;
  tipo: 'receita' | 'despesa';
  categoria: string | number;
  data: string;
}

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api').replace(
  /\/$/,
  '',
);
const TRANSACOES_URL = `${API_BASE_URL}/transacoes`;

function obterValorNumerico(valor: Transacao['valor']): number {
  const valorNumerico = typeof valor === 'string' ? Number.parseFloat(valor) : valor;

  return Number.isFinite(valorNumerico) ? valorNumerico : 0;
}

export default function Dashboard() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [saldo, setSaldo] = useState(0);
  const [receitas, setReceitas] = useState(0);
  const [despesas, setDespesas] = useState(0);
  const [erro, setErro] = useState<string | null>(null);
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let efeitoAtivo = true;

    fetch(TRANSACOES_URL)
      .then((resposta) => {
        if (!resposta.ok) {
          throw new Error(`A API respondeu com o status ${resposta.status}`);
        }

        return resposta.json() as Promise<unknown>;
      })
      .then((dados) => {
        if (!Array.isArray(dados)) {
          throw new Error('A API retornou um formato de dados inválido');
        }

        const transacoesRecebidas = dados as Transacao[];
        let totalReceitas = 0;
        let totalDespesas = 0;

        transacoesRecebidas.forEach((item) => {
          const valor = obterValorNumerico(item.valor);

          if (item.tipo === 'receita') {
            totalReceitas += valor;
          } else {
            totalDespesas += valor;
          }
        });

        if (efeitoAtivo) {
          setTransacoes(transacoesRecebidas);
          setReceitas(totalReceitas);
          setDespesas(totalDespesas);
          setSaldo(totalReceitas - totalDespesas);
        }
      })
      .catch(() => {
        if (efeitoAtivo) {
          setErro('Não foi possível carregar as transações. Verifique se a API está em execução.');
        }
      })
      .finally(() => {
        if (efeitoAtivo) {
          setCarregando(false);
        }
      });

    return () => {
      efeitoAtivo = false;
    };
  }, [tentativa]);

  return (
    <View style={styles.container}>
      <View style={styles.cardSaldo}>
        <Text style={styles.labelSaldo}>Saldo Total</Text>
        <Text style={styles.valorSaldo}>R$ {saldo.toFixed(2)}</Text>
      </View>

      <View style={styles.row}>
        <CardSaldo titulo="Receitas" valor={`R$ ${receitas.toFixed(2)}`} corFundo="#1B5E20" />
        <CardSaldo titulo="Despesas" valor={`R$ ${despesas.toFixed(2)}`} corFundo="#B71C1C" />
      </View>

      <Text style={styles.tituloExtrato}>Extrato</Text>

      {carregando ? (
        <ActivityIndicator size="large" color="#BB72FF" />
      ) : erro ? (
        <View style={styles.erroContainer}>
          <Text style={styles.erroTexto}>{erro}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setCarregando(true);
              setErro(null);
              setTentativa((valorAtual) => valorAtual + 1);
            }}
            style={({ pressed }) => [styles.botaoTentarNovamente, pressed && styles.botaoPressionado]}>
            <Text style={styles.botaoTexto}>Tentar novamente</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={transacoes}
          ListEmptyComponent={<Text style={styles.listaVazia}>Nenhuma transação cadastrada.</Text>}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const valor = obterValorNumerico(item.valor);

            return (
              <View style={styles.itemCard}>
                <View>
                  <Text style={styles.descricao}>{item.descricao}</Text>
                  <Text style={styles.categoria}>
                    {item.categoria} - {item.data}
                  </Text>
                </View>

                <Text
                  style={item.tipo === 'receita' ? styles.valorReceita : styles.valorDespesa}>
                  {item.tipo === 'receita' ? '+' : '-'} R$ {valor.toFixed(2)}
                </Text>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#021113', padding: 20, paddingTop: 50 },
  cardSaldo: { backgroundColor: '#144800', padding: 20, borderRadius: 12, marginBottom: 15 },
  labelSaldo: { color: '#fff', fontSize: 16 },
  valorSaldo: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginTop: 5 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 20 },
  tituloExtrato: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  itemCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  descricao: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  categoria: { color: '#aaa', fontSize: 12, marginTop: 4 },
  valorReceita: { color: '#91ce92', fontSize: 16, fontWeight: 'bold' },
  valorDespesa: { color: '#f88379', fontSize: 16, fontWeight: 'bold' },
  erroContainer: { alignItems: 'center', paddingVertical: 24 },
  erroTexto: { color: '#f88379', fontSize: 15, textAlign: 'center', marginBottom: 16 },
  botaoTentarNovamente: {
    backgroundColor: '#BB72FF',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  botaoPressionado: { opacity: 0.8 },
  botaoTexto: { color: '#160026', fontSize: 14, fontWeight: 'bold' },
  listaVazia: { color: '#aaa', fontSize: 14, textAlign: 'center', paddingVertical: 24 },
});
