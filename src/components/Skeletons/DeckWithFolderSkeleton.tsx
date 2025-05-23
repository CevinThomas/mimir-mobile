import React from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withDelay } from 'react-native-reanimated';
import DeckListItemSkeleton from './DeckListItemSkeleton';

interface DeckWithFolderSkeletonProps {
  numberOfDecks?: number;
  hideFolder?: boolean;
}

export default function DeckWithFolderSkeleton({ 
  numberOfDecks = 3, 
  hideFolder = false 
}: DeckWithFolderSkeletonProps) {
  // Animation values for the skeleton loading effect
  const opacity = useSharedValue(0.3);

  // Create animated style
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  // Start the animation when the component mounts
  React.useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 1000 }),
      -1,
      true
    );
  }, []);

  return (
    <View style={{ marginBottom: 40 }}>
      {!hideFolder && (
        <View>
          <View style={{
            marginBottom: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* Folder icon placeholder */}
              <Animated.View 
                style={[
                  animatedStyle, 
                  { 
                    width: 24, 
                    height: 24, 
                    backgroundColor: '#E0E0E0', 
                    borderRadius: 4 
                  }
                ]} 
              />
              
              {/* Folder name placeholder */}
              <Animated.View 
                style={[
                  animatedStyle, 
                  { 
                    width: 120, 
                    height: 18, 
                    backgroundColor: '#E0E0E0', 
                    borderRadius: 4,
                    marginLeft: 10
                  }
                ]} 
              />
            </View>
            
            {/* Expand/collapse button placeholder */}
            <View style={{ width: '50%', alignItems: 'flex-end' }}>
              <Animated.View 
                style={[
                  animatedStyle, 
                  { 
                    width: 20, 
                    height: 20, 
                    backgroundColor: '#E0E0E0', 
                    borderRadius: 10 
                  }
                ]} 
              />
            </View>
          </View>
        </View>
      )}
      
      {/* Render the specified number of deck skeletons */}
      {Array.from({ length: numberOfDecks }).map((_, index) => (
        <DeckListItemSkeleton key={index} />
      ))}
    </View>
  );
}