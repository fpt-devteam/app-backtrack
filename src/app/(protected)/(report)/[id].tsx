import { usePostById } from '@/src/hooks/usePostById';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const ReportDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { post, loading, error, notFound, retry } = usePostById(id);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading report...</Text>
      </View>
    );
  }

  if (notFound) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.notFoundEmoji}>🔍</Text>
        <Text style={styles.notFoundText}>Report not found</Text>
        <Text style={styles.notFoundSubtext}>
          This report may have been deleted or doesn&apos;t exist
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>⚠️ {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={retry}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Type Badge */}
      <View
        style={[
          styles.typeBadge,
          post.postType === 'Lost' ? styles.lostBadge : styles.foundBadge,
        ]}
      >
        <Text style={styles.typeBadgeText}>{post.postType.toUpperCase()}</Text>
      </View>

      {/* Images */}
      {post.imageUrls.length > 0 && (
        <View style={styles.imagesSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {post.imageUrls.map((url) => (
              <Image
                key={url}
                source={{ uri: url }}
                style={styles.image}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.itemName}>{post.itemName}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Posted:</Text>
          <Text style={styles.metaValue}>
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Event Time:</Text>
          <Text style={styles.metaValue}>
            {new Date(post.eventTime).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{post.description}</Text>
        </View>

        {/* Material */}
        {post.material.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Materials</Text>
            <View style={styles.tagContainer}>
              {post.material.map((item) => (
                <View key={`material-${item}`} style={styles.tag}>
                  <Text style={styles.tagText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Brands */}
        {post.brands.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Brands</Text>
            <View style={styles.tagContainer}>
              {post.brands.map((item) => (
                <View key={`brand-${item}`} style={styles.tag}>
                  <Text style={styles.tagText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Colors */}
        {post.colors.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Colors</Text>
            <View style={styles.tagContainer}>
              {post.colors.map((item) => (
                <View key={`color-${item}`} style={styles.tag}>
                  <Text style={styles.tagText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Location */}
        {post.location && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.locationCard}>
              <Text style={styles.locationText}>
                📍 Latitude: {post.location.latitude.toFixed(6)}
              </Text>
              <Text style={styles.locationText}>
                📍 Longitude: {post.location.longitude.toFixed(6)}
              </Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  notFoundEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  notFoundText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  notFoundSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  typeBadge: {
    alignSelf: 'flex-start',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  lostBadge: {
    backgroundColor: '#FF3B30',
  },
  foundBadge: {
    backgroundColor: '#34C759',
  },
  typeBadgeText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  imagesSection: {
    marginBottom: 16,
  },
  image: {
    width: 300,
    height: 300,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
  },
  content: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  itemName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  metaLabel: {
    fontSize: 14,
    color: '#999',
    width: 100,
  },
  metaValue: {
    fontSize: 14,
    color: '#000',
    flex: 1,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#E8F4FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  locationCard: {
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  locationText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
});

export default ReportDetailScreen;
