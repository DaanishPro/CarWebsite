"use client"

import { Button } from "@/components/ui/button"

interface TrendingTagsProps {
  onTagClick: (tag: string) => void
  activeTag: string
}

const tags = [
  "Top Deals",
  "Under ₹5L",
  "Electric Cars",
  "EMI Options",
  "SUVs",
  "Sedans",
  "Hatchbacks",
  "Luxury Cars",
  "Vintage",
]

export default function TrendingTags({ onTagClick, activeTag }: TrendingTagsProps) {
  return (
    <div className="w-full max-w-5xl mx-auto overflow-x-auto py-4 px-4 md:px-6 scrollbar-hide">
      <div className="flex gap-3 whitespace-nowrap">
        {tags.map((tag) => (
          <Button
            key={tag}
            variant={activeTag === tag ? "default" : "outline"}
            className={`rounded-full px-4 py-2 text-sm transition-colors ${
              activeTag === tag
                ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => onTagClick(tag)}
          >
            {tag}
          </Button>
        ))}
      </div>
    </div>
  )
}
