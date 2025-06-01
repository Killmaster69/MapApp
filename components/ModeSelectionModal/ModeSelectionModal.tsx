import React from 'react';
import { StyleSheet, View, Modal, Text, Button } from 'react-native';

interface ModeSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectMode: (mode: 'DRIVE' | 'BICYCLE' | 'WALK') => void;
}

const ModeSelectionModal: React.FC<ModeSelectionModalProps> = ({
  visible,
  onClose,
  onSelectMode
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
          <Text>Selecciona un modo de transporte para la ruta:</Text>
          <Button title="Conducir" onPress={() => onSelectMode('DRIVE')} />
          <Button title="Bicicleta" onPress={() => onSelectMode('BICYCLE')} />
          <Button title="Caminar" onPress={() => onSelectMode('WALK')} />
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

export default ModeSelectionModal;