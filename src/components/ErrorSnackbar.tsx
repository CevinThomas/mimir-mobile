import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import NormalText from './Typography/NormalText';

interface ErrorSnackbarProps {
  visible: boolean;
  message?: string;
  onHide: () => void;
}

const ErrorSnackbar: React.FC<ErrorSnackbarProps> = ({ 
  visible, 
  message = 'Something went wrong. Please contact customer support.', 
  onHide 
}) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onHide();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [visible, onHide]);

  if (!visible) return null;

  return (
    <Animated.View 
      entering={FadeInDown} 
      exiting={FadeOutDown} 
      style={styles.container}
    >
      <View style={styles.errorIcon}>
        <NormalText style={styles.iconText}>!</NormalText>
      </View>
      <View>
        <NormalText style={styles.messageText}>{message}</NormalText>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    backgroundColor: '#E53935', // Red color for error
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  errorIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    color: '#E53935',
    fontWeight: 'bold',
  },
  messageText: {
    color: 'white',
    fontWeight: '500',
  }
});

export default ErrorSnackbar;