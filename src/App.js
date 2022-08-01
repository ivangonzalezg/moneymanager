import React, { useEffect, useMemo, useReducer } from "react";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { useColorMode, Box, StatusBar, Icon } from "native-base";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SplashScreen from "react-native-splash-screen";
import Feather from "react-native-vector-icons/Feather";
import ProgressDialog from "./components/progressDialog";
import {
  initialProgress,
  initialState,
  ProgressContext,
  progressReducer,
  StateContext,
  stateReducer,
} from "./contexts";
import constants from "./constants";
import colors from "./constants/colors";
import routes from "./routes";
import database from "./database";

import HomeScreen from "./screens/home";
import TransactionScreen from "./screens/transaction";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const { VISIBLE, HIDDEN } = constants.progress;
const { TRANSACTIONS } = constants.state;

const Tabs = () => {
  const { colorMode } = useColorMode();

  return (
    <Tab.Navigator
      backBehavior="history"
      initialRouteName={routes.home}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor:
            colorMode === "light" ? colors.blueGray[200] : colors.blueGray[700],
        },
        tabBarActiveTintColor:
          colorMode === "light" ? colors.muted[700] : colors.muted[200],
        tabBarInactiveTintColor:
          colorMode === "light" ? colors.muted[300] : colors.muted[900],
      }}>
      <Tab.Screen
        name={routes.home}
        component={HomeScreen}
        options={{
          tabBarIcon: props => (
            <Icon as={Feather} name="inbox" size="xl" {...props} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  const { colorMode } = useColorMode();
  const [progress, dispatchProgress] = useReducer(
    progressReducer,
    initialProgress,
  );
  const [state, dispatchState] = useReducer(stateReducer, initialState);

  const progressContext = useMemo(
    () => ({
      showProgressDialog: (label = "") =>
        dispatchProgress({ type: VISIBLE, label }),
      hideProgressDialog: () => dispatchProgress({ type: HIDDEN }),
    }),
    [],
  );

  const stateContext = useMemo(
    () => ({
      updateTransactions: () => dispatchState({ type: TRANSACTIONS }),
      ...state,
    }),
    [state],
  );

  useEffect(() => {
    database.configure().then(() => dispatchState({ type: TRANSACTIONS }));
    SplashScreen.hide();
  }, []);

  return (
    <NavigationContainer
      theme={{
        dark: colorMode === "dark",
        colors: { ...DefaultTheme.colors, background: colors.transparent },
      }}>
      <ProgressContext.Provider value={progressContext}>
        <StateContext.Provider value={stateContext}>
          <Box
            _dark={{ bg: "blueGray.900" }}
            _light={{ bg: "blueGray.50" }}
            flex={1}>
            <StatusBar
              backgroundColor={
                colorMode === "light"
                  ? colors.blueGray[50]
                  : colors.blueGray[900]
              }
              barStyle={
                colorMode === "light" ? "dark-content" : "light-content"
              }
            />
            <Stack.Navigator
              screenOptions={{ headerShown: false }}
              initialRouteName={routes.tabs}>
              <Stack.Screen name={routes.tabs} component={Tabs} />
              <Stack.Screen
                name={routes.transaction}
                component={TransactionScreen}
                initialParams={{}}
              />
            </Stack.Navigator>
          </Box>
          <ProgressDialog visible={progress.visible} label={progress.label} />
        </StateContext.Provider>
      </ProgressContext.Provider>
    </NavigationContainer>
  );
};

export default App;
