import { useEffect, useState } from "react";
import { View, Text, StatusBar, StyleSheet, Dimensions, TextInput,
         Button, Pressable, FlatList, Alert, TouchableOpacity, Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");



export default function ControleGastos() {
    /* 
        Listagem de gastos com formulario de cadastro.
    */
    const [modalVisible, setModalVisible] = useState(false);

    const [descricao, setDescricao] = useState("");
    const [valor, setValor] = useState("");

    const [totalGastos, setTotalGastos] = useState(0);
    const [gastos, setGastos] = useState<{id: number, descricao: string, valor: number}[]>([
        {
            id: 1,
            descricao: "Compras",
            valor: 100
        },
        {
            id: 2,
            descricao: "Aluguel",
            valor: 500
        },
        {
            id: 3,
            descricao: "Internet",
            valor: 50
        },
        {
            id: 4,
            descricao: "Game Pass",
            valor: 39
        },
        {
            id: 5,
            descricao: "Lanches",
            valor: 70
        },
        {
            id: 6,
            descricao: "Água",
            valor: 70
        },
        {
            id: 7,
            descricao: "Pizzas",
            valor: 50
        },
        {
            id: 8,
            descricao: "Internet",
            valor: 50
        },
        {
            id: 9,
            descricao: "Game Pass",
            valor: 39
        },
        {
            id: 10,
            descricao: "Lanches",
            valor: 70
        },
        {
            id: 11,
            descricao: "Água",
            valor: 70
        },
        {
            id: 12,
            descricao: "Pizzas",
            valor: 50
        }
    ]);


    const salvarNovoGasto = () => {

        if (!descricao.trim() || !valor.trim()) {
            Alert.alert("Erro", "Preencha todos os campos corretamente.");
            return;
        }

        const novoGasto = {
            id: gastos.length + 1,
            descricao: descricao,
            valor: parseFloat(valor)
        };
        setGastos([...gastos, novoGasto]);
        setModalVisible(false)
    }

    const removeGasto = (id: any) => {
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
                  setGastos((prevItens) => prevItens.filter((item:any) => item.id !== id));
                },
              },
            ],
            { cancelable: false }
        );
        // let _itens = itens.filter((item) => item.id !== id);
        // setItens(_itens);
    }

    return(
        <View style={styles.container}>

            <Text style={styles.titulo}>Controle de Gastos</Text>
            
            <TouchableOpacity style={styles.botao} onPress={() => setModalVisible(true)}>
                <Text style={styles.textBotao}>Cadastrar</Text>
            </TouchableOpacity>

            {/* Modal */}
            <Modal
                animationType="slide" // Tipo de animação: "slide", "fade" ou "none"
                transparent={true} // Fundo transparente
                visible={modalVisible} // Controla se o modal está aberto ou fechado
                onRequestClose={() => setModalVisible(false)} // Fecha ao apertar "Voltar" no Android
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modal}>
                        <Text>Descrição</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nome do Item"
                            value={descricao}
                            onChangeText={setDescricao}
                        />

                        <Text>Valor</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nome do Item"
                            value={valor}
                            onChangeText={setValor}
                        />
                        <Button title="Salvar" onPress={() => salvarNovoGasto()} />

                        {/* <Button title="Fechar" onPress={() => setModalVisible(false)} /> */}
                    </View>
                </View>
            </Modal>

            {/* <Pressable style={styles.botao} onPress={null} >
                <Text style={styles.textBotao}>Cadastrar</Text>
            </Pressable> */}

            <FlatList
                data={gastos}
                keyExtractor={(item: any) => item.id}
                renderItem={({ item }) => (
                    <Pressable style={styles.card} onLongPress={() => removeGasto(item.id)}>
                        <Text style={styles.titulo}>{item.descricao}</Text>
                        <Text style={styles.titulo}>{item.valor}</Text>
                    </Pressable>
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
            />

            {/* <View style={styles.listagem}>
            {gastos.map((item) => (
                <View style={styles.card}>
                    <Text style={styles.titulo}>{item.descricao}</Text>
                    <Text style={styles.titulo}>{item.valor}</Text>
                </View>
            ))}
            </View> */}

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, // Ocupa toda a tela
        padding: 20,
        backgroundColor: "#f4f4f4",
    },
    card: {
        borderColor: "#6200ee",
        borderWidth: 1,
        marginBottom: 10,
        borderRadius: 5,
        padding: 10,
        flex: 1,
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#8ecae6",
        height: 150,
    },
    listagem: {
        overflow: "scroll",
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
        marginBottom: 20,
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
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)", // Fundo escuro semi-transparente
    },
    modal: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        width: "80%",
        alignItems: "center",
    },
    textoModal: {
        fontSize: 18,
        marginBottom: 10,
    },
});
