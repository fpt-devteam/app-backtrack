import { useLocalSearchParams, useRouter } from 'expo-router';
import { Check, Eye, QrCode, ShieldCheck } from 'phosphor-react-native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const ActivatedItemScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ publicCode: string }>();
  const publicCode = params.publicCode || '';

  const handleViewProtectedItems = () => {
    router.push('/(protected)/(qr)');
  };

  const handleReturnHome = () => {
    router.push('/(protected)/(qr)');
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#f8f9fa' }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40
      }}>
        {/* Success Icon */}
        <View style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          borderWidth: 3,
          borderColor: '#0ea5e9',
          backgroundColor: '#ffffff',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 32,
        }}>
          <Check size={60} color="#0ea5e9" />
        </View>

        {/* Title */}
        <Text style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: '#1f2937',
          textAlign: 'center',
          marginBottom: 12,
        }}>
          Item Activated &
        </Text>
        <Text style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: '#1f2937',
          textAlign: 'center',
          marginBottom: 16,
        }}>
          Protected!
        </Text>

        {/* Subtitle */}
        <Text style={{
          fontSize: 14,
          color: '#6b7280',
          textAlign: 'center',
          marginBottom: 40,
          lineHeight: 20,
        }}>
          Your item is now securely registered{'\n'}
          and protected by BackTrack
        </Text>

        {/* Status Section */}
        <View style={{
          width: '100%',
          backgroundColor: '#ffffff',
          borderRadius: 12,
          padding: 20,
          marginBottom: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 2,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <ShieldCheck size={20} color="#0ea5e9" style={{ marginRight: 8 }} />
            <View>
              <Text style={{ fontSize: 10, color: '#9ca3af', fontWeight: '600', marginBottom: 2 }}>
                STATUS
              </Text>
              <Text style={{ fontSize: 14, color: '#0ea5e9', fontWeight: '600' }}>
                Active Protection
              </Text>
            </View>
          </View>

          {/* Identifier Section */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <QrCode size={20} color="#0ea5e9" style={{ marginRight: 8 }} />
            <View>
              <Text style={{ fontSize: 10, color: '#9ca3af', fontWeight: '600', marginBottom: 2 }}>
                IDENTIFIER
              </Text>
              <Text style={{ fontSize: 14, color: '#1f2937', fontWeight: '600' }}>
                Public Code: {publicCode}
              </Text>
            </View>
          </View>
        </View>

        {/* View Protected Items Button */}
        <TouchableOpacity
          style={{
            width: '100%',
            backgroundColor: '#0ea5e9',
            borderRadius: 8,
            paddingVertical: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
            shadowColor: '#0ea5e9',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
          }}
          onPress={handleViewProtectedItems}
        >
          <Eye size={20} color="#ffffff" style={{ marginRight: 8 }} />
          <Text style={{
            color: '#ffffff',
            fontSize: 16,
            fontWeight: '600',
          }}>
            View My Protected Items
          </Text>
        </TouchableOpacity>

        {/* Return to Home Link */}
        <TouchableOpacity onPress={handleReturnHome}>
          <Text style={{
            color: '#0ea5e9',
            fontSize: 14,
            fontWeight: '500',
          }}>
            Return to Home
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ActivatedItemScreen;
