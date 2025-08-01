import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { wp, hp, normalize } from '../utils/responsive';
import loggingService from '../services/loggingService';

const PerformanceMonitor = ({ children, componentName = 'Unknown' }) => {
  const [metrics, setMetrics] = useState({
    renderCount: 0,
    renderTime: 0,
    memoryUsage: 0,
    lastRenderTime: 0,
  });
  
  const renderStartTime = useRef(0);
  const renderCount = useRef(0);
  const focusStartTime = useRef(0);

  // Track render performance
  useEffect(() => {
    const startTime = performance.now();
    renderStartTime.current = startTime;
    renderCount.current += 1;

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      setMetrics(prev => ({
        ...prev,
        renderCount: renderCount.current,
        renderTime,
        lastRenderTime: renderTime,
      }));

      // Log slow renders
      if (renderTime > 16) { // 60fps threshold
        loggingService.warn(`Slow render detected in ${componentName}`, {
          renderTime,
          renderCount: renderCount.current,
          componentName,
        });
      }
    };
  });

  // Track screen focus performance
  useFocusEffect(
    React.useCallback(() => {
      const startTime = performance.now();
      focusStartTime.current = startTime;

      loggingService.info(`Screen focused: ${componentName}`, {
        timestamp: new Date().toISOString(),
        componentName,
      });

      return () => {
        const endTime = performance.now();
        const focusDuration = endTime - startTime;
        
        loggingService.info(`Screen unfocused: ${componentName}`, {
          focusDuration,
          componentName,
        });
      };
    }, [componentName])
  );

  // Memory usage monitoring (simplified)
  useEffect(() => {
    const memoryInterval = setInterval(() => {
      // In a real app, you'd use a native module to get actual memory usage
      const estimatedMemory = Math.random() * 100; // Placeholder
      
      setMetrics(prev => ({
        ...prev,
        memoryUsage: estimatedMemory,
      }));

      if (estimatedMemory > 80) {
        loggingService.warn(`High memory usage detected in ${componentName}`, {
          memoryUsage: estimatedMemory,
          componentName,
        });
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(memoryInterval);
  }, [componentName]);

  // Performance warning thresholds
  const isSlowRender = metrics.lastRenderTime > 16;
  const isHighMemory = metrics.memoryUsage > 80;
  const isFrequentRenders = metrics.renderCount > 100;

  // Only show warnings in development
  if (!__DEV__) {
    return children;
  }

  return (
    <View style={styles.container}>
      {children}
      
      {/* Performance warnings overlay */}
      {(isSlowRender || isHighMemory || isFrequentRenders) && (
        <View style={styles.warningOverlay}>
          <Text style={styles.warningTitle}>Performance Warnings:</Text>
          
          {isSlowRender && (
            <Text style={styles.warningText}>
              ⚠️ Slow render: {metrics.lastRenderTime.toFixed(2)}ms
            </Text>
          )}
          
          {isHighMemory && (
            <Text style={styles.warningText}>
              ⚠️ High memory: {metrics.memoryUsage.toFixed(1)}%
            </Text>
          )}
          
          {isFrequentRenders && (
            <Text style={styles.warningText}>
              ⚠️ Frequent renders: {metrics.renderCount}
            </Text>
          )}
          
          <TouchableOpacity
            style={styles.dismissButton}
            onPress={() => {
              // Dismiss warnings
            }}
          >
            <Text style={styles.dismissText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  warningOverlay: {
    position: 'absolute',
    top: hp(10),
    right: wp(2),
    backgroundColor: '#FFF3CD',
    borderColor: '#FFEAA7',
    borderWidth: 1,
    borderRadius: wp(2),
    padding: wp(3),
    maxWidth: wp(40),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  warningTitle: {
    fontSize: normalize(12),
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: hp(1),
  },
  warningText: {
    fontSize: normalize(10),
    color: '#856404',
    marginBottom: hp(0.5),
  },
  dismissButton: {
    alignSelf: 'flex-end',
    marginTop: hp(1),
  },
  dismissText: {
    fontSize: normalize(10),
    color: '#856404',
    textDecorationLine: 'underline',
  },
});

export default PerformanceMonitor; 