import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoritePin } from '../constants';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoritePin[]>([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Error loading favorites', error);
      }
    };

    loadFavorites();
  }, []);

  const saveFavoritesToStorage = async (favoritesToSave: FavoritePin[]) => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(favoritesToSave));
    } catch (error) {
      console.error('Error saving favorites', error);
    }
  };

  const addFavorite = (newFavorite: FavoritePin) => {
    const updatedFavorites = [...favorites, newFavorite];
    setFavorites(updatedFavorites);
    saveFavoritesToStorage(updatedFavorites);
  };

  const updateFavoriteLocation = (oldFavorite: FavoritePin, newCoordinates: { latitude: number, longitude: number }) => {
    const updatedFavorites = favorites.map((fav) =>
      fav.latitude === oldFavorite.latitude && fav.longitude === oldFavorite.longitude
        ? { ...fav, ...newCoordinates }
        : fav
    );
    setFavorites(updatedFavorites);
    saveFavoritesToStorage(updatedFavorites);
  };

  const updateFavorite = (editedFavorite: FavoritePin) => {
    const updatedFavorites = favorites.map((fav) =>
      fav.latitude === editedFavorite.latitude && fav.longitude === editedFavorite.longitude
        ? editedFavorite
        : fav
    );
    setFavorites(updatedFavorites);
    saveFavoritesToStorage(updatedFavorites);
  };

  const deleteFavorite = (favoriteToDelete: FavoritePin) => {
    const updatedFavorites = favorites.filter(
      (fav) => fav.latitude !== favoriteToDelete.latitude || fav.longitude !== favoriteToDelete.longitude
    );
    setFavorites(updatedFavorites);
    saveFavoritesToStorage(updatedFavorites);
  };

  return {
    favorites,
    addFavorite,
    updateFavorite,
    updateFavoriteLocation,
    deleteFavorite
  };
};