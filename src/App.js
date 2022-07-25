import React, { useMemo, useReducer } from "react";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { useColorMode, Box, StatusBar } from "native-base";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
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

import HomeScreen from "./screens/home";
import TransactionScreen from "./screens/transaction";

const Stack = createNativeStackNavigator();

const { VISIBLE, HIDDEN } = constants.progress;
const { TRANSACTIONS } = constants.state;

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
            flex={1}
            safeArea>
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
              initialRouteName={routes.home}>
              <Stack.Screen name={routes.home} component={HomeScreen} />
              <Stack.Screen
                name={routes.transaction}
                component={TransactionScreen}
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
