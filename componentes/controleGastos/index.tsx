import { useEffect, useState } from "react";
import { View, Text, StatusBar, StyleSheet, Dimensions, TextInput,
         Button, Pressable, FlatList, Alert, TouchableOpacity, Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
//import lib icons for react native
import { MaterialIcons } from '@expo/vector-icons';
import { TextInputMask } from 'react-native-masked-text';

const { width, height } = Dimensions.get("window");

export default function ControleGastos() {
    /* 
        Listagem de gastos com formulario de cadastro.
    */
    const [modalVisible, setModalVisible] = useState(false);

    const [descricao, setDescricao] = useState("");
    const [valor, setValor] = useState("");

    const [totalGastos, setTotalGastos] = useState(0);
    const [gastos, setGastos] = useState<{id: number, descricao: string, valor: number}[]>([]);


    useEffect(() => {
        carregarGastos();
    }, []);

    useEffect(() => {
        const total = gastos.reduce((total, item) => {
            if (isNaN(item.valor)) {
                return total; // Ignora itens inválidos
            }
            
            console.log("valor item:", item.valor);

            return total + item.valor;
        }, 0);
    
        setTotalGastos(total);
    }, [gastos]);

    const carregarGastos = async () => {
        try {
            const gastosSalvos = await AsyncStorage.getItem("@gastos");
            if(gastosSalvos){
                setGastos(JSON.parse(gastosSalvos));
            }
        } catch (error) {
            console.error("Erro ao carregar os itens:", error);
        }
    }

    const salvarGastos = async (novaLista: any[]) => {
        try {
            await AsyncStorage.setItem("@gastos", JSON.stringify(novaLista));
        } catch(error){
            console.error("Erro ao salvar gastos:", error);
        }
    }

    const salvarNovoGasto = async() => {

        if (!descricao.trim() || !valor.trim()) {
            Alert.alert("Erro", "Preencha todos os campos corretamente.");
            return;
        }

        const parsedValor = parseFloat(valor.replace(/[^\d,]/g, "").replace(",", ".")); //converte moeda para float

        if (isNaN(parsedValor)) {
            Alert.alert("Erro", "Valor inválido.");
            return;
        }

        const novoGasto = {
            id: gastos.length + 1,
            descricao: descricao,
            valor: parsedValor
        };

        const novaLista = [...gastos, novoGasto];
        setGastos(novaLista);
        setModalVisible(false);
        setDescricao("");
        setValor("");

        await salvarGastos(novaLista); //salva no asyncStorage
    }

    const removeGasto = async(id: any) => {
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
                onPress: async() => {
                  // Agora sim, remove o item após a confirmação
                  const novaLista = gastos.filter((item:any) => item.id !== id);
                  setGastos(novaLista);
                  await salvarGastos(novaLista);
                },
              },
            ],
            { cancelable: false }
        );
    }

    const limpaForm = () => {
        setDescricao("");
        setValor("");
    }

    return(
        <View style={styles.container}>

            <Text style={styles.titulo}>Controle de Gastos</Text>
            
            <TouchableOpacity style={styles.botao} onPress={() => setModalVisible(true)}>
                <Text style={styles.textBotao}>Cadastrar</Text>
            </TouchableOpacity>

            <Text style={styles.totalGeral}>
                {/* Total Geral: R$ {isNaN(totalGastos) ? "0.00" : totalGastos.toFixed(2)} */}
                {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                }).format(totalGastos)}

            </Text>

            {/* Modal */}
            <Modal
                animationType="slide" // Tipo de animação: "slide", "fade" ou "none"
                transparent={true} // Fundo transparente
                visible={modalVisible} // Controla se o modal está aberto ou fechado
                onRequestClose={() => setModalVisible(false)} // Fecha ao apertar "Voltar" no Android
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modal}>
                        {/* Ícone de fechar */}
                        <TouchableOpacity onPress={() => [setModalVisible(false), limpaForm()]} style={styles.closeButton}>
                            <MaterialIcons name="close" size={24} color="black" />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Novo Gasto</Text>

                        <Text>Descrição</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nome do Item"
                            value={descricao}
                            onChangeText={setDescricao}
                        />

                        <Text>Valor</Text>
                        <TextInputMask
                            type={'money'}
                            options={{
                            precision: 2, // Quantos números após a vírgula
                            separator: ',', // Separador decimal
                            delimiter: '.', // Delimitador de milhar
                            }}
                            value={valor}
                            onChangeText={setValor}
                            style={styles.input}
                            placeholder="R$ 0,00"
                        />
                        {/* <TextInput
                            style={styles.input}
                            placeholder="Nome do Item"
                            value={valor}
                            onChangeText={setValor}
                        /> */}
                        <Button title="Salvar" onPress={() => salvarNovoGasto()} />

                        {/* <Button title="Fechar" onPress={() => setModalVisible(false)} /> */}
                    </View>
                </View>
            </Modal>

            <FlatList
                data={gastos}
                keyExtractor={(item: any) => item.id}
                renderItem={({ item }) => (
                    <Pressable style={styles.card} onLongPress={() => removeGasto(item.id)}>
                        <Text style={styles.titulo}>{item.descricao}</Text>
                        <Text style={styles.titulo}>
                            {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                            }).format(item.valor)}
                        </Text>
                    </Pressable>
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
            />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, // Ocupa toda a tela
        padding: 20,
        backgroundColor: "#f9c74f",
    },
    card: {
        backgroundColor: "#5aa9e6",
        borderColor: "#6200ee",
        borderWidth: 1,
        marginBottom: 10,
        borderRadius: 5,
        padding: 10,
        flex: 1,
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        height: 100,
    },
    listagem: {
        overflow: "scroll",
    },
    titulo: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10,
        marginTop: 10,
        textAlign: "center",
    },
    input: {
        backgroundColor: "#fff",
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#ccc",
        width: "80%",
    },
    botao: {
        backgroundColor: "#57cc99",
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
        marginTop: 10,
        marginBottom: 20,
        textAlign: "center",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)", // Fundo escuro semi-transparente
    },
    modal: {
        backgroundColor: "#f9c74f",
        padding: 10,
        borderRadius: 10,
        width: "80%",
        alignItems: "center",
    },
    textoModal: {
        fontSize: 18,
        marginBottom: 10,
    },
    closeButton: {
        alignSelf: "flex-end",
        padding: 5,
    },
    modalTitle: {
        fontSize: 25,

    }
});
