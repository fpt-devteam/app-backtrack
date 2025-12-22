
import PostFiltersComponent from '@/src/features/report/components/PostFilters/PostFilters';
import { usePosts } from '@/src/features/report/hooks/usePosts';
import { PostFilters, PostListItem } from '@/src/features/report/types/report.type';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const ReportScreen = () => {
  const router = useRouter();

  const [filters, setFilters] = useState<PostFilters>({
    postType: null,
    searchTerm: '',
    location: null,
    radiusInKm: null,
  });

  const [showFilters, setShowFilters] = useState(false);

  const {
    posts,
    loading,
    refreshing,
    loadingMore,
    error,
    hasMore,
    totalCount,
    loadMore,
    refresh,
    retry,
  } = usePosts(filters);

  const handlePostPress = useCallback(
    (postId: string) => {
      router.push(`/(protected)/(report)/${postId}` as any);
    },
    [router]
  );

  const handleEndReached = useCallback(() => {
    if (hasMore && !loadingMore && !loading) {
      loadMore();
    }
  }, [hasMore, loadingMore, loading, loadMore]);

  const renderPostItem = ({ item }: { item: PostListItem }) => (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() => handlePostPress(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.postHeader}>
        <View
          style={[
            styles.typeBadge,
            item.postType === 'Lost' ? styles.lostBadge : styles.foundBadge,
          ]}
        >
          <Text style={styles.typeBadgeText}>{item.postType}</Text>
        </View>
        <Text style={styles.postDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>

      {item.imageUrls.length > 0 && (
        <Image
          source={{ uri: item.imageUrls[0] }}
          style={styles.postImage}
          resizeMode="cover"
        />
      )}

      <View style={styles.postContent}>
        <Text style={styles.itemName}>{item.itemName}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        {item.location && (
          <Text style={styles.location}>
            📍 {item.location.latitude.toFixed(4)}, {item.location.longitude.toFixed(4)}
          </Text>
        )}

        {item.material.length > 0 && (
          <Text style={styles.tags} numberOfLines={1}>
            Material: {item.material.join(', ')}
          </Text>
        )}

        {item.colors.length > 0 && (
          <Text style={styles.tags} numberOfLines={1}>
            Colors: {item.colors.join(', ')}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => {
    if (loading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No reports found</Text>
        <Text style={styles.emptySubtext}>
          Try adjusting your filters or create a new report
        </Text>
      </View>
    );
  };

  const renderErrorState = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>⚠️ {error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={retry}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#007AFF" />
        <Text style={styles.footerText}>Loading more...</Text>
      </View>
    );
  };

  const renderLoadingSkeleton = () => (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3].map((i) => (
        <View key={i} style={styles.skeletonCard}>
          <View style={styles.skeletonImage} />
          <View style={styles.skeletonLine} />
          <View style={[styles.skeletonLine, { width: '60%' }]} />
        </View>
      ))}
    </View>
  );

  if (error && !posts.length) {
    return renderErrorState();
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Reports</Text>
          <Text style={styles.headerSubtitle}>
            {totalCount} {totalCount === 1 ? 'report' : 'reports'} found
          </Text>
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Text style={styles.filterButtonText}>
            {showFilters ? '✕ Close' : '⚙ Filters'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      {showFilters && (
        <PostFiltersComponent
          filters={filters}
          onApplyFilters={(newFilters: PostFilters) => {
            setFilters(newFilters);
            setShowFilters(false);
          }}
        />
      )}

      {/* List */}
      {loading && !refreshing && posts.length === 0 ? (
        renderLoadingSkeleton()
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPostItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tintColor="#007AFF"
            />
          }
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={true}
        />
      )}

      {/* Create Button */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.push('/(protected)/(report)/create')}
      >
        <Text style={styles.createButtonText}>+ Create Report</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  filterButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 80,
  },
  postCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  lostBadge: {
    backgroundColor: '#FFE0E0',
  },
  foundBadge: {
    backgroundColor: '#E0F7E0',
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  postDate: {
    fontSize: 12,
    color: '#999',
  },
  postImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#E0E0E0',
  },
  postContent: {
    padding: 12,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  location: {
    fontSize: 12,
    color: '#007AFF',
    marginBottom: 4,
  },
  tags: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  skeletonContainer: {
    padding: 16,
  },
  skeletonCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  skeletonImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 12,
  },
  skeletonLine: {
    height: 16,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 8,
  },
  createButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ReportScreen;