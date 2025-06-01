import React from 'react';
import { StyleSheet, View, Modal, Text, Button } from 'react-native';
import { FavoritePin } from '../../constants/index';

interface OptionsModalProps {
  visible: boolean;
  favorite: FavoritePin | null;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

const OptionsModal: React.FC<OptionsModalProps> = ({
  visible,
  favorite,
  onEdit,
  onDelete,
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
          <Text>Selecciona una opción para "{favorite?.name}":</Text>
          <Button title="Editar" onPress={onEdit} />
          <Button title="Eliminar" onPress={onDelete} />
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
});

export default OptionsModal;