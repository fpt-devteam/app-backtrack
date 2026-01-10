import { AppHeader, ImageCarousel } from '@/src/shared/components'
import { formatIsoDate } from '@/src/shared/utils'
import React, { useMemo } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import type { Post } from '../../types'

type MatchingDetailScreenProps = {
  startPost: Post
  targetPost: Post
}

const safeText = (v?: string | null) => (v && v.trim().length > 0 ? v : 'N/A')

const getFirstImage = (post: Post) => post.imageUrls?.[0] ?? ''

const normalizeText = (v?: string | null) => (v ?? '').trim().toLowerCase()

type CompareRowProps = {
  icon?: React.ReactNode
  label: string
  left: string
  right: string
  isMatch?: boolean
}

const CompareRow = ({ icon, label, left, right, isMatch }: CompareRowProps) => {
  const badgeBg = isMatch ? 'bg-emerald-600/10' : 'bg-slate-200/60'
  const badgeText = isMatch ? 'text-emerald-700' : 'text-slate-600'

  return (
    <View className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden">
      <View className="flex-row items-center justify-between px-5 pt-5 pb-4">
        <View className="flex-row items-center gap-3">
          <View className="w-9 h-9 items-center justify-center rounded-2xl bg-blue-50 border border-blue-600/15">
            {icon ?? <Text className="text-[12px] font-extrabold text-blue-700">{label.slice(0, 2).toUpperCase()}</Text>}
          </View>
          <Text className="text-[16px] font-extrabold text-slate-900">{label}</Text>
        </View>

        <View className={`px-3 py-1.5 rounded-full ${badgeBg}`}>
          <Text className={`text-[12px] font-bold ${badgeText}`}>{isMatch ? 'Matched' : 'Different'}</Text>
        </View>
      </View>

      <View className="h-[1px] bg-slate-900/5 mx-4" />

      <View className="flex-row">
        <View className="flex-1 px-5 py-4">
          <Text className="text-[12px] text-slate-500 font-display">Start post</Text>
          <Text className="mt-1 text-[14px] text-slate-900" numberOfLines={3}>
            {left}
          </Text>
        </View>

        <View className="w-[1px] bg-slate-900/5" />

        <View className="flex-1 px-5 py-4">
          <Text className="text-[12px] text-slate-500 font-display">Target post</Text>
          <Text className="mt-1 text-[14px] text-slate-900" numberOfLines={3}>
            {right}
          </Text>
        </View>
      </View>
    </View>
  )
}

type MiniPostCardProps = { post: Post; label: string }

const MiniPostCard = ({ post, label }: MiniPostCardProps) => {
  const img = getFirstImage(post)

  return (
    <View className="flex-1 bg-white rounded-3xl border-2 border-slate-200 overflow-hidden">
      <View className="h-[120px] bg-slate-100">
        <ImageCarousel data={img ? [img] : []} imageHeight={120} autoScrollInterval={999999} showLoadingIndicator={true} />
      </View>

      <View className="px-4 pt-4 pb-5 gap-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-[12px] text-slate-500 font-display">{label}</Text>
        </View>
        <Text className="text-[15px] font-extrabold text-slate-900" numberOfLines={2}>
          {safeText(post.itemName)}
        </Text>

        <View className="flex-row items-center gap-2">
          <Text className="text-[12px] font-extrabold text-blue-700">LOC</Text>
          <Text className="flex-1 text-[12px] text-slate-600" numberOfLines={1}>
            {safeText(post.displayAddress)}
          </Text>
        </View>

        <View className="flex-row items-center gap-2">
          <Text className="text-[12px] font-extrabold text-blue-700">TIME</Text>
          <Text className="text-[12px] text-slate-600" numberOfLines={1}>
            {formatIsoDate(post.eventTime)}
          </Text>
        </View>
      </View>
    </View>
  )
}

const getScoreLabel = (score: number) => {
  if (score >= 75) return 'High match'
  if (score >= 45) return 'Likely match'
  return 'Low match'
}

const getScoreColor = (score: number) => {
  if (score >= 75) return 'bg-emerald-600'
  if (score >= 45) return 'bg-amber-500'
  return 'bg-rose-600'
}

const MatchingDetailScreen = ({ startPost, targetPost }: MatchingDetailScreenProps) => {
  const samePlaceId = useMemo(() => {
    const a = startPost.externalPlaceId
    const b = targetPost.externalPlaceId
    return !!a && !!b && a === b
  }, [startPost.externalPlaceId, targetPost.externalPlaceId])

  const hasLocationA = !!startPost.location
  const hasLocationB = !!targetPost.location

  const locationMatched = useMemo(() => {
    if (!hasLocationA || !hasLocationB) return false
    if (samePlaceId) return true

    // fallback: small distance threshold (approx) using lat/lng delta
    const dLat = Math.abs(startPost.location.latitude - targetPost.location.latitude)
    const dLng = Math.abs(startPost.location.longitude - targetPost.location.longitude)
    // ~0.002 deg ~ 200m-ish depending on latitude
    return dLat <= 0.002 && dLng <= 0.002
  }, [hasLocationA, hasLocationB, samePlaceId, startPost.location, targetPost.location])

  const timeMatched = useMemo(() => {
    const a = startPost.eventTime instanceof Date ? startPost.eventTime.getTime() : new Date(startPost.eventTime).getTime()
    const b = targetPost.eventTime instanceof Date ? targetPost.eventTime.getTime() : new Date(targetPost.eventTime).getTime()
    if (Number.isNaN(a) || Number.isNaN(b)) return false
    const diff = Math.abs(a - b)
    // within 24h
    return diff <= 24 * 60 * 60 * 1000
  }, [startPost.eventTime, targetPost.eventTime])

  const marksMatched = useMemo(() => {
    const a = normalizeText(startPost.distinctiveMarks)
    const b = normalizeText(targetPost.distinctiveMarks)
    if (!a || !b) return false
    // quick heuristic: one contains the other or share a decent overlap
    if (a.includes(b) || b.includes(a)) return true
    const aTokens = new Set(a.split(/\s+/).filter(Boolean))
    const bTokens = new Set(b.split(/\s+/).filter(Boolean))
    const common = [...aTokens].filter((t) => bTokens.has(t)).length
    const denom = Math.max(1, Math.min(aTokens.size, bTokens.size))
    return common / denom >= 0.5
  }, [startPost.distinctiveMarks, targetPost.distinctiveMarks])

  const nameMatched = useMemo(() => {
    const a = normalizeText(startPost.itemName)
    const b = normalizeText(targetPost.itemName)
    if (!a || !b) return false
    if (a === b) return true
    // simple substring match for UX signal
    return a.includes(b) || b.includes(a)
  }, [startPost.itemName, targetPost.itemName])

  const matchScore = useMemo(() => {
    const checks = [nameMatched, locationMatched, timeMatched, marksMatched]
    const matchedCount = checks.filter(Boolean).length
    return Math.round((matchedCount / checks.length) * 100)
  }, [nameMatched, locationMatched, timeMatched, marksMatched])

  const scoreLabel = useMemo(() => getScoreLabel(matchScore), [matchScore])
  const scoreColor = useMemo(() => getScoreColor(matchScore), [matchScore])

  return (
    <View className="flex-1 bg-slate-50">
      <AppHeader title="Matching Detail" />

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Summary */}
        <View className="mx-4 mt-4 bg-white rounded-3xl border-2 border-slate-200 overflow-hidden">
          <View className="px-5 pt-5 pb-4">
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-1">
                <Text className="text-[18px] font-extrabold text-slate-900">Compare details</Text>
                <Text className="mt-1 text-[13px] text-slate-600">
                  Review key attributes before contacting the owner.
                </Text>
              </View>

              <View className={`px-3 py-2 rounded-2xl ${scoreColor}`}>
                <Text className="text-white text-[12px] font-extrabold">{matchScore}%</Text>
                <Text className="text-white/95 text-[11px] font-bold">{scoreLabel}</Text>
              </View>
            </View>

            {/* quick chips */}
            <View className="mt-4 flex-row flex-wrap gap-2">
              <View className={`px-3 py-1.5 rounded-full ${nameMatched ? 'bg-emerald-600/10' : 'bg-slate-200/60'}`}>
                <Text className={`text-[12px] font-bold ${nameMatched ? 'text-emerald-700' : 'text-slate-600'}`}>
                  Name
                </Text>
              </View>
              <View className={`px-3 py-1.5 rounded-full ${locationMatched ? 'bg-emerald-600/10' : 'bg-slate-200/60'}`}>
                <Text className={`text-[12px] font-bold ${locationMatched ? 'text-emerald-700' : 'text-slate-600'}`}>
                  Location
                </Text>
              </View>
              <View className={`px-3 py-1.5 rounded-full ${timeMatched ? 'bg-emerald-600/10' : 'bg-slate-200/60'}`}>
                <Text className={`text-[12px] font-bold ${timeMatched ? 'text-emerald-700' : 'text-slate-600'}`}>
                  Time
                </Text>
              </View>
              <View className={`px-3 py-1.5 rounded-full ${marksMatched ? 'bg-emerald-600/10' : 'bg-slate-200/60'}`}>
                <Text className={`text-[12px] font-bold ${marksMatched ? 'text-emerald-700' : 'text-slate-600'}`}>
                  Marks
                </Text>
              </View>
            </View>
          </View>

          {matchScore < 45 && (
            <View className="px-5 pb-5">
              <View className="flex-row gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-600/15">
                <View className="w-9 h-9 rounded-2xl bg-amber-100 items-center justify-center">
                  <Text className="text-[16px] font-extrabold text-amber-800">!</Text>
                </View>
                <Text className="flex-1 text-[12px] leading-[18px] text-amber-900">
                  The match looks weak. Double-check photos and details before taking action.
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Header Row: 2 cards */}
        <View className="mx-4 mt-4 flex-row gap-3">
          <MiniPostCard post={startPost} label="Start post" />
          <MiniPostCard post={targetPost} label="Target post" />
        </View>

        {/* Body Row: comparisons */}
        <View className="mx-4 mt-4 gap-3">
          <CompareRow
            label="Item name"
            left={safeText(startPost.itemName)}
            right={safeText(targetPost.itemName)}
            isMatch={nameMatched}
          />

          <CompareRow
            label="Location"
            left={safeText(startPost.displayAddress)}
            right={safeText(targetPost.displayAddress)}
            isMatch={locationMatched}
          />

          <CompareRow
            label="Event time"
            left={formatIsoDate(startPost.eventTime)}
            right={formatIsoDate(targetPost.eventTime)}
            isMatch={timeMatched}
          />

          <CompareRow
            label="Distinctive marks"
            left={safeText(startPost.distinctiveMarks)}
            right={safeText(targetPost.distinctiveMarks)}
            isMatch={marksMatched}
          />

          <CompareRow
            label="Description"
            left={safeText(startPost.description)}
            right={safeText(targetPost.description)}
            isMatch={normalizeText(startPost.description) === normalizeText(targetPost.description) && !!normalizeText(startPost.description)}
          />
        </View>

        {/* Actions (placeholder for future) */}
        <View className="mx-4 mt-5">
          <TouchableOpacity activeOpacity={0.9} className="w-full bg-primary rounded-2xl py-4 items-center justify-center">
            <Text className="text-white font-extrabold">Continue</Text>
            <Text className="text-white/90 text-[12px]">(Hook this up to chat / report / save)</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

export default MatchingDetailScreen
