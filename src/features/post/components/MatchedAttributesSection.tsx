import { SimilarPost } from '@/src/features/post/types'
import { AppAccordion } from '@/src/shared/components'
import { colors } from '@/src/shared/theme'
import { formatDateTime, formatDistance } from '@/src/shared/utils'
import { MotiView } from 'moti'
import {
  CaretDownIcon,
  ClockIcon,
  MapPinIcon,
  PaletteIcon,
} from 'phosphor-react-native'
import React, { useState } from 'react'
import { Text, View } from 'react-native'

// ─── Helpers ────────────────────────────────────────────────────────────────

const getScoreColor = (score: number) => {
  if (score >= 0.7) return colors.emerald[600]
  if (score >= 0.4) return colors.amber[500]
  return colors.red[400]
}

// ─── ScoreCircle ─────────────────────────────────────────────────────────────

const ScoreCircle = ({ score }: { score: number }) => {
  const color = getScoreColor(score)
  const label = parseFloat((score * 100).toFixed(2))
  return (
    <View
      className="w-12 h-12 rounded-full items-center justify-center border-2"
      style={{ borderColor: color }}
    >
      <Text
        style={{ fontSize: 10, fontWeight: '800', color, lineHeight: 13 }}
        numberOfLines={1}
      >
        {label}%
      </Text>
    </View>
  )
}

// ─── DetailsList ─────────────────────────────────────────────────────────────

type DetailPoint = { label: string; value: string; isHighlight?: boolean }

const DetailsList = ({ details }: { details: DetailPoint[] }) => (
  <View className="gap-2.5">
    {details.map((detail, index) => (
      <View key={index} className="flex-row items-start gap-2">
        <View
          className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
          style={{
            backgroundColor: detail.isHighlight ? colors.emerald[600] : colors.amber[500],
          }}
        />
        <Text className="text-xs flex-1 leading-4" style={{ color: colors.slate[600] }}>
          <Text className="font-semibold" style={{ color: colors.slate[700] }}>
            {detail.label}:{' '}
          </Text>
          {detail.value}
        </Text>
      </View>
    ))}
  </View>
)

// ─── AttributeSection ────────────────────────────────────────────────────────

export interface AttributeSectionProps {
  icon: React.ReactNode
  iconBg: string
  title: string
  score?: number
  fallbackLabel?: string
  children?: React.ReactNode
  defaultExpanded?: boolean
}

export const AttributeSection = ({
  icon,
  iconBg,
  title,
  score,
  fallbackLabel,
  children,
  defaultExpanded = false,
}: AttributeSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <View
      className="rounded-2xl overflow-hidden mb-3"
      style={{ backgroundColor: colors.white }}
    >
      <AppAccordion
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded((prev) => !prev)}
        collapsedContent={
          <View className="flex-row items-center px-4 py-3 gap-3">
            <View
              className="w-10 h-10 rounded-full items-center justify-center shrink-0"
              style={{ backgroundColor: iconBg }}
            >
              {icon}
            </View>

            <Text
              className="font-semibold text-base flex-1"
              style={{ color: colors.slate[900] }}
              numberOfLines={1}
            >
              {title}
            </Text>

            {score !== undefined ? (
              <ScoreCircle score={score} />
            ) : fallbackLabel ? (
              <Text
                className="text-xs font-semibold shrink-0"
                style={{ color: colors.sky[500] }}
              >
                {fallbackLabel}
              </Text>
            ) : null}

            <MotiView
              animate={{ rotate: isExpanded ? '180deg' : '0deg' }}
              transition={{ type: 'timing', duration: 250 }}
            >
              <CaretDownIcon size={14} color={colors.slate[400]} />
            </MotiView>
          </View>
        }
        expandedContent={
          children ? (
            <View
              className="px-4 pb-4 pt-3 border-t"
              style={{ borderColor: colors.slate[100] }}
            >
              {children}
            </View>
          ) : null
        }
      />
    </View>
  )
}

// ─── MatchedAttributesSection ────────────────────────────────────────────────

interface MatchedAttributesSectionProps {
  similarPost: SimilarPost
}

export const MatchedAttributesSection = ({ similarPost }: MatchedAttributesSectionProps) => {
  const { criteria, distanceMeters, eventTime } = similarPost

  const locDetails: DetailPoint[] =
    criteria?.location?.points?.map((p) => ({
      label: p.label,
      value: p.detail,
      isHighlight: true,
    })) ?? []

  const timeDetails: DetailPoint[] =
    criteria?.timeWindow?.points?.map((p) => ({
      label: p.label,
      value: p.detail,
      isHighlight: true,
    })) ?? [{ label: 'Event time', value: formatDateTime(eventTime), isHighlight: true }]

  const visualScore = criteria
    ? (criteria.visualAnalysis.score + criteria.description.score) / 2
    : undefined

  const visualDetails: DetailPoint[] = [
    ...(criteria?.visualAnalysis?.points ?? []),
    ...(criteria?.description?.points ?? []),
  ].map((p) => ({ label: p.label, value: p.detail, isHighlight: true }))

  return (
    <View className="mt-2">
      <Text className="font-bold text-lg mb-4 px-1" style={{ color: colors.slate[900] }}>
        Matched Attributes
      </Text>

      <AttributeSection
        icon={<MapPinIcon size={20} color={colors.sky[500]} weight="fill" />}
        iconBg={colors.sky[50]}
        title="Location"
        score={criteria?.location?.score}
        fallbackLabel={formatDistance(distanceMeters)}
      >
        {locDetails.length > 0 && <DetailsList details={locDetails} />}
      </AttributeSection>

      <AttributeSection
        icon={<ClockIcon size={20} color={colors.blue[500]} weight="fill" />}
        iconBg={colors.sky[50]}
        title="Time Window"
        score={criteria?.timeWindow?.score}
      >
        <DetailsList details={timeDetails} />
      </AttributeSection>

      <AttributeSection
        icon={<PaletteIcon size={20} color={colors.amber[500]} weight="fill" />}
        iconBg={colors.slate[50]}
        title="Visual & Description"
        score={visualScore}
      >
        {visualDetails.length > 0 && <DetailsList details={visualDetails} />}
      </AttributeSection>
    </View>
  )
}
