import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface RoleSelectorProps {
  rol: 'comprador' | 'vendedor';
  setRol: (rol: 'comprador' | 'vendedor') => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ rol, setRol }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>¿Qué tipo de cuenta deseas crear?</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.option, rol === 'comprador' && styles.optionSelected]}
          onPress={() => setRol('comprador')}
        >
          <Text style={[styles.optionText, rol === 'comprador' && styles.optionTextSelected]}>
            Cliente
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.option, rol === 'vendedor' && styles.optionSelected]}
          onPress={() => setRol('vendedor')}
        >
          <Text style={[styles.optionText, rol === 'vendedor' && styles.optionTextSelected]}>
            Vendedor
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '600',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  option: {
    flex: 1,
    padding: 12,
    borderWidth: 2,
    borderColor: '#1C2E4A',
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
    backgroundColor: '#1C2E4A',
  },
  optionSelected: {
    borderColor: '#FFD700',
    backgroundColor: '#0A1628',
  },
  optionText: {
    color: '#999999',
    fontWeight: 'bold',
    fontSize: 16,
  },
  optionTextSelected: {
    color: '#FFD700',
  }
});
