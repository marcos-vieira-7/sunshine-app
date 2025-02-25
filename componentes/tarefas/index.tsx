import { useEffect, useState } from "react";
import { View, Text, StatusBar, StyleSheet, Dimensions, TextInput, Button, Pressable, FlatList, Alert, TouchableOpacity } from "react-native";

// import { AsyncStorageHook } from "@react-native-async-storage/async-storage/lib/typescript/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

import { useNavigation } from "@react-navigation/native";
import Compras from "../compras";

interface Tarefa {
    id: string;
    descricao: string;
}

export default function Tarefas() {

    const [descricao, setDescricao] = useState('')  ;
    const [tarefas, setTarefas] = useState<Tarefa[]>([]);

    useEffect(() => {
        carregarTarefas();
    },[]);

    // Carregar tarefas no AsyncStorage
    const carregarTarefas = async () => {
        try {
            const tarefasSalvas = await AsyncStorage.getItem("@tarefas");
            if (tarefasSalvas){
                setTarefas(JSON.parse(tarefasSalvas));
            }
        } catch (error) {
            console.error("Erro ao carregar tarefas:", error);
        }
    };

    //Funcao para salvar tarefas no AsyncStorage
    const salvarTarefas = async (novaLista: Tarefa[]) => {
        try{
            await AsyncStorage.setItem("@tarefas", JSON.stringify(novaLista));
        } catch (error){
            console.error("Erro ao salvar tarefas:", error);
        }
    }

    //adicionar nova tarefa
    const adicionarTarefa = async() => {
        if(descricao.trim() === "") return;

        const novaTarefa: Tarefa = {
            id: Math.random().toString(),
            descricao: descricao,
        };

        const novaLista = [...tarefas, novaTarefa];
        setTarefas(novaLista);
        setDescricao("");

        await salvarTarefas(novaLista); //salva no AsyncStorage

    }

    const removerTarefa = async (id: string) => {
        Alert.alert("Remover", "Deseja remover essa tarefa?",[
            {
                text: "Cancelar",
                style: "cancel"
            },
            {
                text: "Remover",
                onPress: async () => {
                    const novaLista = tarefas.filter((tarefa) => tarefa.id !== id);
                    setTarefas(novaLista);
                    await salvarTarefas(novaLista);
                },
            },
        ])
    }

    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            
            {/* <Text style={styles.text}>NEW COMPONENT TASK</Text> */}
            {/* <Button title="Ir para Outra Tela" onPress={() => navigation.navigate("Compras")} /> */}
            <TextInput
                style={styles.input}
                placeholder="Digite a descrição"
                value={descricao}
                onChangeText={setDescricao} 
                />
            <Pressable onPress={adicionarTarefa} style={({pressed}) => [styles.button, {opacity: pressed ? 0.5 : 1}]}>
                <Text>Adicionar</Text>
            </Pressable>
            
            {/* Lista */}
            <View style={styles.lista}>
                <Text style={styles.titulo}>Minhas Tarefas</Text>
                <FlatList
                    data={tarefas}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => (
                        <Pressable 
                            style={styles.item}
                            onLongPress={() => removerTarefa(item.id)} //chama funcao ao tocar
                            android_ripple={{color: "#ccc"}} //efeito de clique no
                        >
                            <Text style={styles.texto}>{item.descricao}</Text>
                        </Pressable>
                    )}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#023047",
        color: "#fff",
        // width: width * 0.9, // 90% da largura da tela
        // height: height * 0.3, // 30% da altura da tela
        // borderRadius: 10,
    },
    lista: {
        margin: 10,
        width:"90%", //percentual ao inves de dimension
    },
    text: {
        color: "#fff",
    },
    input: {
        backgroundColor: "#fff",
        color: "#000",
        width: "80%", //usar percentual
        height: 40, //fixo p nao causar problemas
        borderRadius: 10,
        padding: 10,
    },
    button: {
        // margin: 20,
        width: "80%",
        padding: 10,
        backgroundColor: "#ffb703",
        borderRadius: 10,
        color: "#000",
        fontSize: 20,
    },
    titulo : {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center"
    },
    item: {
        backgroundColor: "#6200ee",
        padding: 15,
        marginVertical: 8,
        borderRadius: 10,
    },
    texto: {
        color: "#fff",
        fontSize: 16,
    },
    separator: {
        height: 10,
    },
});