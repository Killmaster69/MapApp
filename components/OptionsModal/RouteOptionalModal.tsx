import React from 'react';
import { StyleSheet, View, Modal, Text, Button } from 'react-native';
import { FavoritePin } from '../../constants';

interface RouteOptionsModalProps {
  visible: boolean;
  favorite: FavoritePin | null;
  onNavigate: (favorite: FavoritePin) => void;
  onClose: () => void;
}

const RouteOptionsModal: React.FC<RouteOptionsModalProps> = ({
  visible,
  favorite,
  onNavigate,
  onClose
}) => {
  const handleNavigate = () => {
    if (favorite) {
      onNavigate(favorite); // Enviar el favorito como destino para trazar la ruta
    }
    onClose(); // Cerrar el modal después de seleccionar "Cómo llegar"
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text>¿Cómo llegar a {favorite?.name}?</Text>
          <Button title="Cómo llegar" onPress={handleNavigate} />
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

export default RouteOptionsModal;
