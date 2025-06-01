import React from 'react';
import { StyleSheet, View, Modal, Text, TextInput, Button } from 'react-native';

interface FavoriteModalProps {
  visible: boolean;
  isEditing: boolean;
  favoriteName: string;
  onChangeName: (name: string) => void;
  onSave: () => void;
  onClose: () => void;
}

const FavoriteModal: React.FC<FavoriteModalProps> = ({
  visible,
  isEditing,
  favoriteName,
  onChangeName,
  onSave,
  onClose
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text>Ingresa un nombre para este lugar:</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre del lugar"
            value={favoriteName}
            onChangeText={onChangeName}
          />
          <Button 
            title={isEditing ? "Guardar Cambios" : "Guardar Favorito"} 
            onPress={onSave} 
          />
          <Button title="Cancelar" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default FavoriteModal;