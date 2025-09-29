"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  carTypeFilter: string
  setCarTypeFilter: (type: string) => void
  priceRangeFilter: string
  setPriceRangeFilter: (range: string) => void
}

export default function Filters({
  searchTerm,
  setSearchTerm,
  carTypeFilter,
  setCarTypeFilter,
  priceRangeFilter,
  setPriceRangeFilter,
}: FiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-3xl mx-auto mb-8">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by car name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background shadow-sm focus-visible:ring-2 focus-visible:ring-yellow-500"
        />
      </div>
      <Select value={carTypeFilter} onValueChange={setCarTypeFilter}>
        <SelectTrigger className="w-full sm:w-[180px] focus-visible:ring-yellow-500">
          <SelectValue placeholder="Filter by Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Types</SelectItem>
          <SelectItem value="Sedan">Sedan</SelectItem>
          <SelectItem value="SUV">SUV</SelectItem>
          <SelectItem value="Hatchback">Hatchback</SelectItem>
          <SelectItem value="Sports">Sports</SelectItem>
          <SelectItem value="Electric">Electric</SelectItem>
          <SelectItem value="Vintage">Vintage</SelectItem>
          <SelectItem value="Luxury">Luxury</SelectItem>
          <SelectItem value="Compact">Compact</SelectItem>
        </SelectContent>
      </Select>
      <Select value={priceRangeFilter} onValueChange={setPriceRangeFilter}>
        <SelectTrigger className="w-full sm:w-[180px] focus-visible:ring-yellow-500">
          <SelectValue placeholder="Filter by Price" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Prices</SelectItem>
          <SelectItem value="Under 5L">Under ₹5 Lakh</SelectItem>
          <SelectItem value="5L-10L">₹5 Lakh - ₹10 Lakh</SelectItem>
          <SelectItem value="10L-25L">₹10 Lakh - ₹25 Lakh</SelectItem>
          <SelectItem value="25L-50L">₹25 Lakh - ₹50 Lakh</SelectItem>
          <SelectItem value="Over 50L">Over ₹50 Lakh</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
