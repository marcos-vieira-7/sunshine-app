import { useEffect, useState } from "react";
import { View, Text, StatusBar, StyleSheet, Dimensions, TextInput, Button, Pressable, FlatList, Alert, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaskedTextInput } from "react-native-mask-text";

const { width, height } = Dimensions.get("window");

interface Item {
    id: string;
    nome: string;
    valorUnitario: number;
    quantidade: number;
}

export default function Compras() {

    const [nome, setNome] = useState('');
    const [valorUnitario, setValorUnitario] = useState("");
    const [quantidade, setQuantidade] = useState("");
    const [itens, setItens] = useState<Item[]>([]);

    const adicionarItem = () => {

        if (!nome || !valorUnitario || !quantidade) return;

        const novoItem: Item = {
            id: Math.random().toString(),
            nome,
            valorUnitario: parseFloat(valorUnitario.replace(",", ".")),
            quantidade: parseInt(quantidade),
        };

        setItens([...itens, novoItem]);
        setNome("");
        setValorUnitario("");
        setQuantidade("");
    };


    const calcularTotalGeral = () => {
        return itens.reduce((total, item) => total + item.valorUnitario * item.quantidade, 0);
    };

    const removeItem = (id: string) => {
        Alert.alert(
            "Remover",
            "Deseja remover esse item?",
            [
              {
                text: "Não",
                style: "cancel", // O botão de cancelar não faz nada
              },
              {
                text: "Sim",
                onPress: () => {
                  // Agora sim, remove o item após a confirmação
                  setItens((prevItens) => prevItens.filter((item) => item.id !== id));
                },
              },
            ],
            { cancelable: false }
        );
        // let _itens = itens.filter((item) => item.id !== id);
        // setItens(_itens);
    }
    
    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Lista de Compras</Text>
            <Text>Descrição</Text>
            <TextInput
                style={styles.input}
                placeholder="Nome do Item"
                value={nome}
                onChangeText={setNome}
            />
            <Text>Valor Unitário</Text>
            <TextInput
                style={styles.input}
                placeholder="Valor Unitário"
                value={valorUnitario}
                onChangeText={setValorUnitario}
                keyboardType="numeric"
            />
            <Text>Quantidade</Text>
            <TextInput
                style={styles.input}
                placeholder="Quantidade"
                value={quantidade}
                onChangeText={setQuantidade}
                keyboardType="numeric"
            />

            <Pressable style={styles.botao} onPress={adicionarItem}><Text style={styles.textBotao}>Adicionar</Text></Pressable>

            <FlatList
                data={itens}
                keyExtractor={(item) => item.id}
                renderItem={({ item}) => (
                    <Pressable onLongPress={() => removeItem(item.id)}>
                        <View style={styles.item}>
                            <Text style={styles.text}>{item.nome} - {item.quantidade} x R${item.valorUnitario.toFixed(2)}</Text>
                            <Text style={styles.totalItem}>Total: R$ {(item.valorUnitario * item.quantidade).toFixed(2)}</Text>
                        </View>
                    </Pressable>
                )}
            />

            <Text style={styles.totalGeral}>Total Geral: R$ {calcularTotalGeral().toFixed(2)}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f4f4f4",
    },
    titulo: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    input: {
        backgroundColor: "#fff",
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    botao: {
        backgroundColor: "#6200ee",
        padding: 10,
        borderRadius: 5,
    },
    textBotao: {
        color: "#fff",
        fontSize: 16,
        textAlign: "center"
    },
    item: {
        backgroundColor: "#6200ee",
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
    },
    text: {
        color: "#fff",
        fontSize: 16,
    },
    totalItem: {
        color: "#ffeb3b",
        fontWeight: "bold",
    },
    totalGeral: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 20,
        textAlign: "center",
    },
})