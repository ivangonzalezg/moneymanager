import React, { useMemo, useReducer } from "react";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { useColorMode, Box, StatusBar } from "native-base";
import { createStackNavigator } from "@react-navigation/stack";
import ProgressDialog from "./components/progressDialog";
import { initialProgress, ProgressContext, progressReducer } from "./contexts";
import constants from "./constants";
import routes from "./routes";

import HomeScreen from "./screens/home";
import colors from "./constants/colors";

const Stack = createStackNavigator();

const { VISIBLE, HIDDEN } = constants.progress;

const Routes = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={routes.home}>
      <Stack.Screen name={routes.home} component={HomeScreen} />
    </Stack.Navigator>
  );
};

const App = () => {
  const { colorMode } = useColorMode();
  const [progress, dispatchProgress] = useReducer(
    progressReducer,
    initialProgress,
  );

  const progressContext = useMemo(
    () => ({
      showProgressDialog: (label = "") =>
        dispatchProgress({ type: VISIBLE, label }),
      hideProgressDialog: () => dispatchProgress({ type: HIDDEN }),
    }),
    [],
  );

  return (
    <NavigationContainer
      theme={{
        dark: colorMode === "dark",
        colors: { ...DefaultTheme.colors, background: colors.transparent },
      }}>
      <ProgressContext.Provider value={progressContext}>
        <Box
          _dark={{ bg: "blueGray.900" }}
          _light={{ bg: "blueGray.50" }}
          flex={1}
          safeArea>
          <StatusBar
            backgroundColor={
              colorMode === "light" ? colors.blueGray50 : colors.blueGray900
            }
            barStyle={colorMode === "light" ? "dark-content" : "light-content"}
          />
          <Routes />
        </Box>
        <ProgressDialog visible={progress.visible} label={progress.label} />
      </ProgressContext.Provider>
    </NavigationContainer>
  );
};

export default App;
