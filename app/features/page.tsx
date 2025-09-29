import FeatureSection from "@/components/FeatureSection" // This component now includes Filters, TrendingTags, ComparisonTable, MidCtaBanner, and the car cards.

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <FeatureSection />
    </div>
  )
}
