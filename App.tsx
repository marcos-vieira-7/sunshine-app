import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, } from 'react-native';
import Tarefas from './componentes/tarefas';
const { width, height } = Dimensions.get("window");
import Compras from './componentes/compras';
import ControleGastos from './componentes/controleGastos';

//Inclusao de comps para navegacao:
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* <Stack.Screen name="Tarefas" component={Tarefas} /> */}
        {/* <Stack.Screen name="Compras" component={Compras} /> */}
        <Stack.Screen name="ControleGastos" component={ControleGastos} />
      </Stack.Navigator>
    </NavigationContainer>
    // <View style={styles.container}>
    //   <Tarefas/>
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
