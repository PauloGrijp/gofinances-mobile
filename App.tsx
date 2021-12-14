import React, { useEffect } from 'react';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';

import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import { ThemeProvider } from 'styled-components';
import { StatusBar } from 'react-native';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import theme from './src/global/styles/theme';
import { Routes } from './src/routes'
import { AppRoutes } from './src/routes/app.routes';

import SignIn from './src/screens/SignIn';
import { AuthProvider, useAuth } from './src/hooks/auth';

export default function App() {
  const {userStorageLoading} = useAuth()
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

  if (!fontsLoaded || userStorageLoading) {
    return <AppLoading />
  }

  return (
    <ThemeProvider theme={theme}>
      <StatusBar translucent backgroundColor={theme.colors.primary}/>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </ThemeProvider>
  );
}
