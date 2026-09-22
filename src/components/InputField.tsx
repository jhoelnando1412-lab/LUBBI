import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View, Text } from 'react-native';

interface InputFieldProps extends TextInputProps {
  label?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ label, style, ...props }) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor="#888899"
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    color: '#E0E0E0',
    fontSize: 14,
    marginBottom: 6,
    marginLeft: 4,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#2A2A35',
    color: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#3A3A4A',
  },
});
