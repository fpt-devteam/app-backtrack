import { Post } from '@/src/features/post/types'
import { colors } from '@/src/shared/theme'
import {
  calculateHaversineDistance,
  calculateTimeDifference, formatDateTime,
  formatDistance,
  formatTimeDifference
} from '@/src/shared/utils'
import { CheckSquareIcon, ClockIcon, MapPinIcon, PaletteIcon } from 'phosphor-react-native'
import React from 'react'
import { Text, View } from 'react-native'

interface MatchedAttributesSectionProps {
  post1: Post
  post2: Post
}

interface AttributeItemProps {
  icon: React.ReactNode
  title: string
  matchLevel?: string
  description: string
  details?: {
    label: string
    value: string
    isHighlight?: boolean
  }[]
}

const AttributeItem = ({ icon, title, matchLevel, description, details }: AttributeItemProps) => {
  const getMatchLevelColor = (level?: string) => {
    if (!level) return ''
    if (level.includes('Within')) return 'text-primary'
    if (level.includes('High')) return 'text-green-400'
    if (level.includes('Medium')) return 'text-yellow-600'
    return 'text-slate-600'
  }


  return (
    <View className="bg-white rounded-2xl p-4 mb-3">
      <View className="flex-row items-start">
        <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mr-3">
          {icon}
        </View>
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-slate-900 font-semibold text-base">{title}</Text>
            {matchLevel && (
              <Text className={`font-semibold text-sm ${getMatchLevelColor(matchLevel)}`}>
                {matchLevel}
              </Text>
            )}
          </View>
          <Text className="text-slate-600 text-sm">{description}</Text>

          {details && details.length > 0 && (
            <View className="flex-col mt-3 gap-4">
              {details.map((detail, index) => (
                <View key={index} className="flex-row items-center">
                  <View className={`w-2 h-2 rounded-full mr-2 ${detail.isHighlight ? 'bg-green-500' : 'bg-orange-500'}`} />
                  <Text className="text-slate-700 text-xs">
                    {detail.label}: <Text className="font-medium">{detail.value}</Text>
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

export const MatchedAttributesSection = ({ post1, post2 }: MatchedAttributesSectionProps) => {
  // Calculate distance
  const distanceInMeters = calculateHaversineDistance(
    post1.location.latitude,
    post1.location.longitude,
    post2.location.latitude,
    post2.location.longitude
  )

  // Calculate time difference
  const timeDiffInMs = calculateTimeDifference(post1.eventTime, post2.eventTime)

  // Visual features matching (simplified - you can enhance this)
  const visualMatch = 'High Match'
  const visualDescription = `Item names and descriptions suggest similar items.`

  return (
    <View className="mt-4">
      <View className="flex-row items-center mb-4 px-1">
        <CheckSquareIcon size={24} color={colors.primary} weight="fill" />
        <Text className="text-slate-900 font-bold text-xl ml-2">Matched Attributes</Text>
      </View>

      {/* Location Match */}
      <AttributeItem
        icon={<MapPinIcon size={20} color={colors.primary} weight="fill" />}
        title="Location Match"
        matchLevel={`Within ${formatDistance(distanceInMeters)}`}
        description="Items found in same vicinity."
        details={[
          {
            label: post1.postType === 'Lost' ? 'Lost' : 'Found',
            value: post1.displayAddress || 'Unknown',
            isHighlight: false,
          },
          {
            label: post2.postType === 'Found' ? 'Found' : 'Lost',
            value: post2.displayAddress || 'Unknown',
            isHighlight: true,
          },
        ]}
      />

      {/* Time Difference */}
      <AttributeItem
        icon={<ClockIcon size={20} color={colors.primary} weight="fill" />}
        title="Time Difference"
        matchLevel={formatTimeDifference(timeDiffInMs)}
        description="Timestamps align with report."
        details={[
          {
            label: 'Lost',
            value: formatDateTime(post1.eventTime),
            isHighlight: false,
          },
          {
            label: 'Found',
            value: formatDateTime(post2.eventTime),
            isHighlight: true,
          },
        ]}
      />

      {/* Visual Features */}
      <AttributeItem
        icon={<PaletteIcon size={20} color={colors.primary} weight="fill" />}
        title="Visual Features"
        matchLevel={visualMatch}
        description={visualDescription}
      />
    </View>
  )
}
