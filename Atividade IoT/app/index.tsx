import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Accelerometer } from "expo-sensors";

type AccelerationData = {
  x: number;
  y: number;
  z: number;
};

const INITIAL_DATA: AccelerationData = { x: 0, y: 0, z: 0 };

export default function HomeScreen() {
  const [dados, setDados] = useState<AccelerationData>(INITIAL_DATA);
  const [sensorDisponivel, setSensorDisponivel] = useState<boolean | null>(null);

  useEffect(() => {
    let subscription: ReturnType<typeof Accelerometer.addListener> | null = null;
    let ativo = true;

    async function iniciarAcelerometro() {
      try {
        const disponivel = await Accelerometer.isAvailableAsync();

        if (!ativo) return;
        setSensorDisponivel(disponivel);

        if (!disponivel) return;

        Accelerometer.setUpdateInterval(200);
        subscription = Accelerometer.addListener((data) => {
          if (ativo) setDados(data);
        });
      } catch (error) {
        console.warn("Não foi possível iniciar o acelerômetro:", error);
        if (ativo) setSensorDisponivel(false);
      }
    }

    iniciarAcelerometro();

    return () => {
      ativo = false;
      subscription?.remove();
    };
  }, []);

  // A leitura do acelerômetro é normalizada em relação à gravidade (g).
  // Este critério simples funciona como demonstração de nivelamento.
  const nivelado =
    Math.abs(dados.x) < 0.05 && Math.abs(dados.y) < 0.05;

  const anguloX =
    Math.atan2(dados.x, Math.abs(dados.z)) * (180 / Math.PI);
  const anguloY =
    Math.atan2(dados.y, Math.abs(dados.z)) * (180 / Math.PI);

  // Limita o deslocamento para manter a bolha dentro do círculo.
  const deslocamentoX = Math.max(-45, Math.min(45, dados.x * 45));
  const deslocamentoY = Math.max(-45, Math.min(45, dados.y * 45));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.titulo}>NÍVEL DIGITAL</Text>
        <Text style={styles.subtitulo}>
          Medidor de inclinação do smartphone
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Status do aparelho</Text>

          {sensorDisponivel === false ? (
            <Text style={styles.statusErro}>SENSOR INDISPONÍVEL</Text>
          ) : (
            <Text
              style={[
                styles.status,
                { color: nivelado ? "#22C55E" : "#F59E0B" },
              ]}
            >
              {nivelado ? "NIVELADO" : "INCLINADO"}
            </Text>
          )}

          <View style={styles.bolhaArea}>
            <View style={styles.linhaVertical} />
            <View style={styles.linhaHorizontal} />
            <View
              style={[
                styles.bolha,
                {
                  transform: [
                    { translateX: deslocamentoX },
                    { translateY: deslocamentoY },
                  ],
                },
              ]}
            />
          </View>

          <Text style={styles.instrucao}>
            Incline o celular para observar a bolha.
          </Text>
          {sensorDisponivel === false && (
            <Text style={styles.aviso}>
              Teste em um smartphone físico compatível com o sensor.
            </Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Dados do acelerômetro</Text>
          <InfoRow label="Eixo X" value={dados.x.toFixed(3)} />
          <InfoRow label="Eixo Y" value={dados.y.toFixed(3)} />
          <InfoRow label="Eixo Z" value={dados.z.toFixed(3)} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Ângulo de inclinação</Text>
          <InfoRow label="Horizontal" value={`${anguloX.toFixed(1)}°`} />
          <InfoRow label="Vertical" value={`${anguloY.toFixed(1)}°`} />
        </View>

        <Text style={styles.rodape}>
          Projeto desenvolvido com React Native e Expo Sensors
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.linhaInfo}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.valor}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101827",
  },
  conteudo: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  titulo: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitulo: {
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 25,
    fontSize: 14,
  },
  card: {
    backgroundColor: "#1F2937",
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
  },
  cardTitulo: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  status: {
    fontSize: 23,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  statusErro: {
    color: "#F87171",
    fontSize: 19,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  bolhaArea: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: "#38BDF8",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111827",
    overflow: "hidden",
  },
  linhaVertical: {
    position: "absolute",
    width: 1,
    height: 140,
    backgroundColor: "#64748B",
  },
  linhaHorizontal: {
    position: "absolute",
    width: 140,
    height: 1,
    backgroundColor: "#64748B",
  },
  bolha: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: "#38BDF8",
    elevation: 5,
  },
  instrucao: {
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 15,
  },
  aviso: {
    color: "#FCA5A5",
    textAlign: "center",
    marginTop: 10,
    fontSize: 12,
  },
  linhaInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  label: {
    color: "#D1D5DB",
    fontSize: 16,
  },
  valor: {
    color: "#38BDF8",
    fontSize: 17,
    fontWeight: "bold",
  },
  rodape: {
    color: "#6B7280",
    textAlign: "center",
    fontSize: 11,
    marginTop: 5,
  },
});
