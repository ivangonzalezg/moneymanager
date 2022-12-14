import React, { useEffect, useMemo, useReducer, useState } from "react";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import {
  useColorMode,
  Box,
  StatusBar,
  Icon,
  useColorModeValue,
} from "native-base";
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
import notificationService from "./utils/notificationService";

import HomeScreen from "./screens/home";
import TransactionScreen from "./screens/transaction";
import ChartsScreen from "./screens/charts";
import SettingsScreen from "./screens/settings";
import CategoriesScreen from "./screens/categories";
import CategoryScreen from "./screens/category";
import AppearanceScreen from "./screens/appearance";
import NotificationsScreen from "./screens/notifications";
import SearchScreen from "./screens/search";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const Tabs = props => {
  const { navigation } = props;

  const onNotification = () => navigation.navigate(routes.transaction);

  useEffect(() => {
    notificationService.getInitialNotification(onNotification);
    notificationService.startListener(onNotification);
  }, []);

  return (
    <Tab.Navigator
      backBehavior="history"
      initialRouteName={routes.home}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: useColorModeValue(
            colors.blueGray[200],
            colors.blueGray[800],
          ),
          borderTopColor: useColorModeValue(
            colors.blueGray[400],
            colors.blueGray[400],
          ),
        },
        tabBarActiveTintColor: useColorModeValue(
          colors.muted[800],
          colors.muted[100],
        ),
        tabBarInactiveTintColor: useColorModeValue(
          colors.muted[400],
          colors.muted[600],
        ),
      }}>
      <Tab.Screen
        name={routes.home}
        component={HomeScreen}
        options={{
          tabBarIcon: _props => (
            <Icon as={Feather} name="inbox" size="xl" {..._props} />
          ),
        }}
      />
      <Tab.Screen
        name={routes.charts}
        component={ChartsScreen}
        options={{
          tabBarIcon: _props => (
            <Icon as={Feather} name="pie-chart" size="xl" {..._props} />
          ),
        }}
      />
      <Tab.Screen
        name={routes.settings}
        component={SettingsScreen}
        options={{
          tabBarIcon: _props => (
            <Icon as={Feather} name="settings" size="xl" {..._props} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [progress, dispatchProgress] = useReducer(
    progressReducer,
    initialProgress,
  );
  const [state, dispatchState] = useReducer(stateReducer, initialState);
  const [isSplashScreen, setIsSplashScreen] = useState(true);

  const progressContext = useMemo(
    () => ({
      showProgressDialog: (label = "") =>
        dispatchProgress({ type: constants.progress.VISIBLE, label }),
      hideProgressDialog: () =>
        dispatchProgress({ type: constants.progress.HIDDEN }),
    }),
    [],
  );

  const stateContext = useMemo(
    () => ({
      updateTransactions: () =>
        dispatchState({ type: constants.state.TRANSACTIONS }),
      updateCategory: category =>
        dispatchState({ type: constants.state.CATEGORY, category }),
      updateCategories: () =>
        database
          .getCategories()
          .then(categories =>
            dispatchState({ type: constants.state.CATEGORIES, categories }),
          ),
      ...state,
    }),
    [state],
  );

  useEffect(() => {
    if (!isSplashScreen) {
      SplashScreen.hide();
    }
  }, [isSplashScreen]);

  const initializeApp = async () => {
    try {
      const _colorMode = await AsyncStorage.getItem(
        constants.storage.COLOR_MODE,
      );
      if (_colorMode && _colorMode !== colorMode) {
        toggleColorMode();
      }
      await database.configure();
      await database.createCategories();
      const categories = await database.getCategories();
      dispatchState({ type: constants.state.CATEGORIES, categories });
      const lastCategory = await AsyncStorage.getItem(
        constants.storage.LAST_CATEGORY,
      );
      if (lastCategory) {
        dispatchState({
          type: constants.state.CATEGORY,
          category: JSON.parse(lastCategory),
        });
      } else {
        dispatchState({
          type: constants.state.CATEGORY,
          category: categories[0],
        });
      }
      setIsSplashScreen(false);
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
              backgroundColor={useColorModeValue(
                colors.blueGray[50],
                colors.blueGray[900],
              )}
              barStyle={useColorModeValue("dark-content", "light-content")}
            />
            {!isSplashScreen && (
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
                <Stack.Screen
                  name={routes.category}
                  component={CategoryScreen}
                  initialParams={{}}
                />
                <Stack.Screen
                  name={routes.appearance}
                  component={AppearanceScreen}
                />
                <Stack.Screen
                  name={routes.notifications}
                  component={NotificationsScreen}
                />
                <Stack.Screen name={routes.search} component={SearchScreen} />
              </Stack.Navigator>
            )}
          </Box>
          <ProgressDialog visible={progress.visible} label={progress.label} />
        </StateContext.Provider>
      </ProgressContext.Provider>
    </NavigationContainer>
  );
};

export default App;
