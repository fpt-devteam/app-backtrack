import { SimilarPost, SimilarPostCriteria } from '@/src/features/post/types'
import { colors } from '@/src/shared/theme'
import { formatDateTime, formatDistance } from '@/src/shared/utils'
import {
  CheckSquareIcon,
  ClockIcon,
  MapPinIcon,
  PaletteIcon,
} from 'phosphor-react-native'
import React from 'react'
import { Text, View } from 'react-native'

interface MatchedAttributesSectionProps {
  similarPost: SimilarPost
}

const getScoreColor = (score: number) => {
  if (score >= 0.7) return colors.emerald[600]
  if (score >= 0.4) return colors.amber[500]
  return colors.red[400]
}

const ScoreBar = ({ score }: { score: number }) => {
  const percentage = parseFloat((score * 100).toFixed(2))
  const barColor = getScoreColor(score)

  return (
    <View className="flex-row items-center gap-2 mt-2">
      <View className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
        <View
          style={{ width: `${percentage}%`, backgroundColor: barColor }}
          className="h-full rounded-full"
        />
      </View>
      <Text className="text-xs font-bold w-8 text-right" style={{ color: barColor }}>
        {percentage}%
      </Text>
    </View>
  )
}

interface AttributeItemProps {
  icon: React.ReactNode
  iconBg: string
  title: string
  score?: number
  fallbackLabel?: string
  description: string
  details?: { label: string; value: string; isHighlight?: boolean }[]
}

const AttributeItem = ({
  icon,
  iconBg,
  title,
  score,
  fallbackLabel,
  description,
  details,
}: AttributeItemProps) => (
  <View className="bg-white rounded-2xl p-4 mb-3">
    <View className="flex-row items-start">
      <View
        className="w-10 h-10 rounded-full items-center justify-center mr-3 mt-0.5"
        style={{ backgroundColor: iconBg }}
      >
        {icon}
      </View>
      <View className="flex-1">
        <Text className="text-slate-900 font-semibold text-base mb-0.5">{title}</Text>
        <Text className="text-slate-500 text-xs">{description}</Text>

        {score !== undefined ? (
          <ScoreBar score={score} />
        ) : fallbackLabel ? (
          <Text className="text-xs font-semibold mt-1.5" style={{ color: colors.sky[500] }}>
            {fallbackLabel}
          </Text>
        ) : null}

        {details && details.length > 0 && (
          <View className="mt-3 gap-2">
            {details.map((detail, index) => (
              <View key={index} className="flex-row items-start gap-2">
                <View
                  className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                  style={{
                    backgroundColor: detail.isHighlight
                      ? colors.emerald[600]
                      : colors.amber[500],
                  }}
                />
                <Text className="text-slate-600 text-xs flex-1 leading-4">
                  <Text className="font-semibold text-slate-700">{detail.label}: </Text>
                  {detail.value}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  </View>
)

export const MatchedAttributesSection = ({ similarPost }: MatchedAttributesSectionProps) => {
  const { criteria, distanceMeters, eventTime } = similarPost

  const locDetails = criteria?.location?.points?.map((p) => ({
    label: p.label,
    value: p.detail,
    isHighlight: true,
  }))

  const timeDetails = criteria?.timeWindow?.points?.map((p) => ({
    label: p.label,
    value: p.detail,
    isHighlight: true,
  })) ?? [{ label: 'Event time', value: formatDateTime(eventTime), isHighlight: true }]

  const visualScore = criteria
    ? (criteria.visualAnalysis.score + criteria.description.score) / 2
    : undefined

  const visualPoints = [
    ...(criteria?.visualAnalysis?.points || []),
    ...(criteria?.description?.points || []),
  ]
  const visualDetails = visualPoints.length > 0
    ? visualPoints.map((p) => ({ label: p.label, value: p.detail, isHighlight: true }))
    : undefined

  return (
    <View className="mt-2">
      <View className="flex-row items-center mb-4 px-1">
        <CheckSquareIcon size={22} color={colors.primary} weight="fill" />
        <Text className="text-slate-900 font-bold text-lg ml-2">Matched Attributes</Text>
      </View>

      <AttributeItem
        icon={<MapPinIcon size={20} color={colors.sky[500]} weight="fill" />}
        iconBg={colors.sky[50]}
        title="Location"
        score={criteria?.location?.score}
        fallbackLabel={formatDistance(distanceMeters)}
        description="Proximity between the two reported locations."
        details={locDetails}
      />

      <AttributeItem
        icon={<ClockIcon size={20} color="#a855f7" weight="fill" />}
        iconBg="#faf5ff"
        title="Time Window"
        score={criteria?.timeWindow?.score}
        description="How closely the event times align."
        details={timeDetails}
      />

      <AttributeItem
        icon={<PaletteIcon size={20} color={colors.amber[500]} weight="fill" />}
        iconBg="#fffbeb"
        title="Visual & Description"
        score={visualScore}
        description="Appearance and description similarity."
        details={visualDetails}
      />
    </View>
  )
}
