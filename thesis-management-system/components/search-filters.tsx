"use client"

import { useState } from "react"
import { ChevronDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface SearchFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedKeywords: Set<string>
  onKeywordToggle: (keyword: string) => void
  allKeywords: string[]
  sortBy: "date" | "relevance"
  onSortChange: (sort: "date" | "relevance") => void
  dateRange: { from: string; to: string }
  onDateRangeChange: (from: string, to: string) => void
  onClearFilters: () => void
}

export default function SearchFilters({
  searchTerm,
  onSearchChange,
  selectedKeywords,
  onKeywordToggle,
  allKeywords,
  sortBy,
  onSortChange,
  dateRange,
  onDateRangeChange,
  onClearFilters,
}: SearchFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const activeFilterCount = [searchTerm, selectedKeywords.size > 0, dateRange.from, dateRange.to].filter(Boolean).length

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <Input
          placeholder="Search by keywords, abstract, or title..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-secondary/50"
        />
      </div>

      {/* Advanced Filters Collapsible */}
      <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced} className="space-y-2">
        <div className="flex items-center justify-between">
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
              Advanced Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </CollapsibleTrigger>
          {(searchTerm || selectedKeywords.size > 0 || dateRange.from || dateRange.to) && (
            <Button variant="ghost" size="sm" onClick={onClearFilters} className="gap-1 text-xs">
              <X className="w-3 h-3" />
              Clear all
            </Button>
          )}
        </div>

        <CollapsibleContent className="space-y-4 pt-4 border-t border-border">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-3">Sort by:</p>
            <div className="flex gap-2">
              {[
                { value: "relevance" as const, label: "Relevance" },
                { value: "date" as const, label: "Newest First" },
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={sortBy === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => onSortChange(option.value)}
                  className={
                    sortBy === option.value ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400" : "bg-transparent"
                  }
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-3">Uploaded within:</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-muted-foreground">From</label>
                <Input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => onDateRangeChange(e.target.value, dateRange.to)}
                  className="bg-secondary/50 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">To</label>
                <Input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => onDateRangeChange(dateRange.from, e.target.value)}
                  className="bg-secondary/50 text-sm"
                />
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Keyword Filters */}
      {allKeywords.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-muted-foreground">Filter by keywords:</p>
            {selectedKeywords.size > 0 && (
              <span className="text-xs text-cyan-500">{selectedKeywords.size} selected</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {allKeywords.map((keyword) => (
              <Badge
                key={keyword}
                onClick={() => onKeywordToggle(keyword)}
                variant={selectedKeywords.has(keyword) ? "default" : "outline"}
                className={`cursor-pointer transition-all ${
                  selectedKeywords.has(keyword)
                    ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400"
                    : "bg-transparent hover:border-cyan-500/50"
                }`}
              >
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
