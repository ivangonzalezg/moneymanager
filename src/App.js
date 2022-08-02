import React, { useEffect, useMemo, useReducer } from "react";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { useColorMode, Box, StatusBar, Icon } from "native-base";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SplashScreen from "react-native-splash-screen";
import Feather from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import ChartsScreen from "./screens/charts";
import SettingsScreen from "./screens/settings";
import CategoriesScreen from "./screens/categories";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const { VISIBLE, HIDDEN } = constants.progress;
const { TRANSACTIONS, CATEGORY, CATEGORIES } = constants.state;
const { LAST_CATEGORY } = constants.storage;

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
            colorMode === "light" ? colors.blueGray[200] : colors.blueGray[800],
          borderTopColor:
            colorMode === "light" ? colors.blueGray[400] : colors.blueGray[400],
        },
        tabBarActiveTintColor:
          colorMode === "light" ? colors.muted[800] : colors.muted[100],
        tabBarInactiveTintColor:
          colorMode === "light" ? colors.muted[400] : colors.muted[600],
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
      <Tab.Screen
        name={routes.charts}
        component={ChartsScreen}
        options={{
          tabBarIcon: props => (
            <Icon as={Feather} name="bar-chart-2" size="xl" {...props} />
          ),
        }}
      />
      <Tab.Screen
        name={routes.settings}
        component={SettingsScreen}
        options={{
          tabBarIcon: props => (
            <Icon as={Feather} name="settings" size="xl" {...props} />
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
      updateCategory: category => dispatchState({ type: CATEGORY, category }),
      updateCategories: categories =>
        dispatchState({ type: CATEGORIES, categories }),
      ...state,
    }),
    [state],
  );

  const initializeApp = async () => {
    try {
      SplashScreen.hide();
      await database.configure();
      dispatchState({ type: TRANSACTIONS });
      await database.createCategories();
      const categories = await database.getCategories();
      dispatchState({ type: CATEGORIES, categories });
      const last_category = await AsyncStorage.getItem(LAST_CATEGORY);
      if (last_category) {
        dispatchState({ type: CATEGORY, category: JSON.parse(last_category) });
      } else {
        dispatchState({ type: CATEGORY, category: categories[0] });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    initializeApp();
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
              <Stack.Screen
                name={routes.categories}
                component={CategoriesScreen}
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
