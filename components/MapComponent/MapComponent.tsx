import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { MapViewRoute } from 'react-native-maps-routes';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useFavorites } from '../../hooks/useThemeColor';
import { LocationCoords, FavoritePin } from '../../constants';
import FavoriteModal from '../FavoriteModal/FavoriteModal';
import ModeSelectionModal from '../ModeSelectionModal/ModeSelectionModal';
import OptionsModal from '../OptionsModal/OptionsModal';

const MapComponent = () => {
  const [origin, setOrigin] = useState<LocationCoords | null>(null);
  const [destination, setDestination] = useState<LocationCoords | null>(null);
  const [tempDestination, setTempDestination] = useState<LocationCoords | null>(null);
  const [userLocation, setUserLocation] = useState<LocationCoords | null>(null);
  const [mode, setMode] = useState<'route' | 'favorite'>('route');
  const [selectedLocation, setSelectedLocation] = useState<LocationCoords | null>(null);
  const [selectedFavorite, setSelectedFavorite] = useState<FavoritePin | null>(null);
  const [lastPress, setLastPress] = useState(0);
  const [selectedMode, setSelectedMode] = useState<'DRIVE' | 'BICYCLE' | 'WALK'>('DRIVE');
  const [isModeSelected, setIsModeSelected] = useState(false);
  
  // Modals visibility states
  const [modalVisible, setModalVisible] = useState(false);
  const [modeSelectionModalVisible, setModeSelectionModalVisible] = useState(false);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  
  // Edit state
  const [editingFavorite, setEditingFavorite] = useState<FavoritePin | null>(null);
  const [newFavoriteName, setNewFavoriteName] = useState<string>('');

  // Map reference for animating to new location
  const mapRef = useRef<MapView>(null);

  // Custom hook for favorites
  const { 
    favorites,
    addFavorite,
    updateFavorite,
    updateFavoriteLocation,
    deleteFavorite
  } = useFavorites();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);

      Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 1 },
        (newLocation) => {
          setUserLocation(newLocation.coords);
        }
      );
    })();
  }, []);

  // Handle Google Places selection
  const handlePlaceSelect = (data: any, details: any) => {
    if (details) {
      const { lat, lng } = details.geometry.location;
      const title = data.description;

      const selectedCoords = {
        latitude: lat,
        longitude: lng,
      };

      // Update selected location
      setSelectedLocation(selectedCoords);

      // Animate map to the selected location
      if (mapRef.current) {
        const region: Region = {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.01, // Adjust zoom level as needed
          longitudeDelta: 0.01,
        };
        
        mapRef.current.animateToRegion(region, 1000);
      }
    }
  };

  const handleMapPress = (e: any) => {
    const { coordinate } = e.nativeEvent;
    if (mode === 'route') {
      if (!origin) {
        setOrigin(coordinate);
      } else if (!destination) {
        setTempDestination(coordinate);
        setModeSelectionModalVisible(true);
      }
    } else if (mode === 'favorite') {
      setSelectedLocation(coordinate);
      setModalVisible(true);
    }
  };

  const handleAddFavorite = () => {
    if (newFavoriteName && selectedLocation) {
      addFavorite({
        ...selectedLocation,
        name: newFavoriteName
      });
      setModalVisible(false);
      setNewFavoriteName('');
      setSelectedLocation(null);
    } else {
      alert('Por favor, ingresa un nombre válido para el pin');
    }
  };

  const handleFavoriteMarkerDragEnd = (e: any, favorite: FavoritePin) => {
    const { coordinate } = e.nativeEvent;
    updateFavoriteLocation(favorite, coordinate);
  };

  const handleEditFavorite = (favorite: FavoritePin) => {
    setEditingFavorite(favorite);
    setNewFavoriteName(favorite.name);
    setModalVisible(true);
    setOptionsModalVisible(false);
  };

  const handleSaveEditedFavorite = () => {
    if (editingFavorite) {
      updateFavorite({
        ...editingFavorite,
        name: newFavoriteName
      });
      setEditingFavorite(null);
      setNewFavoriteName('');
      setModalVisible(false);
    }
  };

  const handleDeleteFavorite = (favorite: FavoritePin) => {
    deleteFavorite(favorite);
    setOptionsModalVisible(false);
  };

  const handleModeToggle = () => {
    setMode(mode === 'route' ? 'favorite' : 'route');
  };

  const handleMarkerPress = (favorite: FavoritePin) => {
    if (mode != 'favorite') return;

    const currentTime = new Date().getTime();
    const delta = currentTime - lastPress;

    if (delta < 2000) { // Doble clic detectado
      setSelectedFavorite(favorite);
      setOptionsModalVisible(true);
    }

    setLastPress(currentTime);
  };

  const handleOriginPress = () => {
    const currentTime = new Date().getTime();
    const delta = currentTime - lastPress;

    if (delta < 2000) { // Doble clic detectado
      setOrigin(null);
      setIsModeSelected(false);
      if (destination) {
        setDestination(null);
      }
    }

    setLastPress(currentTime);
  };

  const handleDestinationPress = () => {
    const currentTime = new Date().getTime();
    const delta = currentTime - lastPress;

    if (delta < 2000) { // Doble clic detectado
      setDestination(null);
      setIsModeSelected(false);
    }

    setLastPress(currentTime);
  };

  const handleModeSelection = (mode: 'DRIVE' | 'BICYCLE' | 'WALK') => {
    setSelectedMode(mode);
    setIsModeSelected(true);
    setDestination(tempDestination);
    setTempDestination(null);
    setModeSelectionModalVisible(false);
  };

  const shouldRenderRoute = isModeSelected && origin && destination;

  return (
    <View style={styles.container}>
      {/* Google Places Autocomplete */}
      <GooglePlacesAutocomplete
        placeholder="Buscar ubicación..."
        fetchDetails={true}
        onPress={handlePlaceSelect}
        query={{
          key: "AIzaSyA8JqU1Jdow9eeW_AOvBIjBA784cEeyKy4",  
          language: "es",
        }}
        styles={{
          container: styles.searchContainer,
          textInput: styles.textInput,
        }}
      />

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={handleMapPress}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {userLocation && <Marker coordinate={userLocation} title="Your Location" />}
        {origin && (
          <Marker
            coordinate={origin}
            title="Origin"
            draggable
            onDragEnd={(e) => setOrigin(e.nativeEvent.coordinate)}
            onPress={handleOriginPress}
          />
        )}
        {destination && (
          <Marker
            coordinate={destination}
            title="Destination"
            draggable
            onDragEnd={(e) => setDestination(e.nativeEvent.coordinate)}
            onPress={handleDestinationPress}
          />
        )}
        {favorites.map((favorite, index) => (
          <Marker
            key={index}
            coordinate={favorite}
            title={favorite.name}
            draggable={mode === 'favorite'}
            onDragEnd={(e) => handleFavoriteMarkerDragEnd(e, favorite)}
            onPress={() => handleMarkerPress(favorite)}
          />
        ))}
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title="Selected Location"
          />
        )}

        {shouldRenderRoute && (
          <MapViewRoute
            origin={origin}
            destination={destination}
            mode={selectedMode}
            apiKey="ExampleAPIKey" 
            strokeWidth={10}
            strokeColor="blue"
          />
        )}
      </MapView>

      <View style={styles.buttonContainer}>
        <Text style={styles.modeText}>{mode === 'route' ? 'Modo: Trazar Ruta' : 'Modo: Agregar Favoritos'}</Text> 
        <Button 
          title={mode === 'route' ? 'Agregar Favoritos' : 'Trazar Ruta'} 
          onPress={handleModeToggle} 
        />
       
      </View>

      <ModeSelectionModal
        visible={modeSelectionModalVisible}
        onClose={() => {
          setModeSelectionModalVisible(false);
          setTempDestination(null);
        }}
        onSelectMode={handleModeSelection}
      />

      <FavoriteModal
        visible={modalVisible}
        isEditing={!!editingFavorite}
        favoriteName={newFavoriteName}
        onChangeName={setNewFavoriteName}
        onSave={editingFavorite ? handleSaveEditedFavorite : handleAddFavorite}
        onClose={() => setModalVisible(false)}
      />

      <OptionsModal
        visible={optionsModalVisible}
        favorite={selectedFavorite}
        onEdit={() => selectedFavorite && handleEditFavorite(selectedFavorite)}
        onDelete={() => selectedFavorite && handleDeleteFavorite(selectedFavorite)}
        onClose={() => setOptionsModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  modeText: { 
    fontSize: 18,
    marginBottom: 10, 
    backgroundColor: 'white',
  },
  searchContainer: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 10,
    zIndex: 1,
    width: '85%',
  },
  textInput: {
    height: 50,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

export default MapComponent;