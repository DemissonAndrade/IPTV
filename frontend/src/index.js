// Telas básicas para completar a estrutura do app mobile


import { View, Text, StyleSheet } from 'react-native';

const LiveTVScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>TV ao Vivo</Text>
      <Text style={styles.subtitle}>Tela em desenvolvimento</Text>
    </View>
  );
};

const VODScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Filmes & Séries</Text>
      <Text style={styles.subtitle}>Tela em desenvolvimento</Text>
    </View>
  );
};

const FavoritesScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Favoritos</Text>
      <Text style={styles.subtitle}>Tela em desenvolvimento</Text>
    </View>
  );
};

const SearchScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Buscar</Text>
      <Text style={styles.subtitle}>Tela em desenvolvimento</Text>
    </View>
  );
};

const LoginScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Login</Text>
      <Text style={styles.subtitle}>Tela em desenvolvimento</Text>
    </View>
  );
};

const RegisterScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Cadastro</Text>
      <Text style={styles.subtitle}>Tela em desenvolvimento</Text>
    </View>
  );
};

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Perfil</Text>
      <Text style={styles.subtitle}>Tela em desenvolvimento</Text>
    </View>
  );
};

const PlayerScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Player</Text>
      <Text style={styles.subtitle}>Tela em desenvolvimento</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#141414',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#b3b3b3',
  },
});

export {
  LiveTVScreen,
  VODScreen,
  FavoritesScreen,
  SearchScreen,
  LoginScreen,
  RegisterScreen,
  ProfileScreen,
  PlayerScreen,
};

