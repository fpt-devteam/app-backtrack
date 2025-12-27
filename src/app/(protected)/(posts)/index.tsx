
import { PostFiltersComponent, PostInfinityScrollView } from '@/src/features/post/components';
import { PostType } from '@/src/features/post/types';
import { PostFilters } from '@/src/features/post/types/post.type';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import { FAB, Portal } from 'react-native-paper';
const FABGroup = FAB.Group;

const PostScreen = () => {
  const router = useRouter();

  const [filters, setFilters] = useState<PostFilters>({
  });

  const handlePressCreate = (type: PostType) => {
    router.push(
      {
        pathname: '/(protected)/(posts)/create',
        params: {
          postType: type,
          mode: 'create',
        }
      }
    );
  };

  useEffect(() => {
    console.log('Filters changed: ', filters);

  }, [filters]);

  return (
    <View style={styles.container}>
      {/* Filters */}
      <PostFiltersComponent
        filters={filters}
        onFilterChange={setFilters}
      />

      {/* List */}
      <PostInfinityScrollView filters={filters} />

      {/* Create Buttons */}
      <CreateFabDropdown handlePressCreate={handlePressCreate} />
    </View>
  );
};

type Props = {
  handlePressCreate: (type: PostType) => void;
};

export function CreateFabDropdown({ handlePressCreate }: Props) {
  const [open, setOpen] = React.useState(false);
  return (
    <Portal>
      <FABGroup
        open={open}
        visible
        icon={open ? "close" : "plus"}
        onStateChange={({ open }) => setOpen(open)}
        actions={[
          {
            icon: "alert-circle-outline",
            label: "Post Lost",
            onPress: () => handlePressCreate(PostType.Lost),
          },
          {
            icon: "check-circle-outline",
            label: "Post Found",
            onPress: () => handlePressCreate(PostType.Found),
          },
        ]}
      />
    </Portal>
  );
}

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

export default PostScreen;
