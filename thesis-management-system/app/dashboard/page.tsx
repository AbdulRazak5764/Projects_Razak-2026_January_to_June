"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Plus, LogOut, BookOpen } from "lucide-react"
import UploadModal from "@/components/upload-modal"
import PaperCard from "@/components/paper-card"
import SearchFilters from "@/components/search-filters"

interface Paper {
  id: string
  abstract: string
  keywords: string[]
  uploadedAt: string
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [papers, setPapers] = useState<Paper[]>([])
  const [filteredPapers, setFilteredPapers] = useState<Paper[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<"date" | "relevance">("date")
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({ from: "", to: "" })
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [allKeywords, setAllKeywords] = useState<string[]>([])

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    setUser(JSON.parse(userData))
    loadPapers()
  }, [router])

  const loadPapers = async () => {
    try {
      const response = await fetch("/api/papers")
      if (response.ok) {
        const data = await response.json()
        setPapers(data)
        setFilteredPapers(data)

        // Extract unique keywords for filter
        const keywords = new Set<string>()
        data.forEach((paper: Paper) => {
          paper.keywords.forEach((k) => keywords.add(k))
        })
        setAllKeywords(Array.from(keywords).sort())
      }
    } catch (err) {
      console.error("Failed to load papers")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    applyFilters(value, selectedKeywords, sortBy, dateRange)
  }

  const handleKeywordToggle = (keyword: string) => {
    const newSelected = new Set(selectedKeywords)
    if (newSelected.has(keyword)) {
      newSelected.delete(keyword)
    } else {
      newSelected.add(keyword)
    }
    setSelectedKeywords(newSelected)
    applyFilters(searchTerm, newSelected, sortBy, dateRange)
  }

  const handleSort = (newSort: "date" | "relevance") => {
    setSortBy(newSort)
    applyFilters(searchTerm, selectedKeywords, newSort, dateRange)
  }

  const handleDateRangeChange = (from: string, to: string) => {
    setDateRange({ from, to })
    applyFilters(searchTerm, selectedKeywords, sortBy, { from, to })
  }

  const applyFilters = (
    search: string,
    keywords: Set<string>,
    sort: "date" | "relevance",
    dates: { from: string; to: string },
  ) => {
    let filtered = [...papers]

    // Filter by search term (abstract or keywords)
    if (search) {
      filtered = filtered.filter(
        (paper) =>
          paper.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase())) ||
          paper.abstract.toLowerCase().includes(search.toLowerCase()),
      )
    }

    // Filter by selected keywords
    if (keywords.size > 0) {
      filtered = filtered.filter((paper) => paper.keywords.some((k) => keywords.has(k)))
    }

    // Filter by date range
    if (dates.from || dates.to) {
      filtered = filtered.filter((paper) => {
        const paperDate = new Date(paper.uploadedAt)
        if (dates.from && new Date(dates.from) > paperDate) return false
        if (dates.to) {
          const toDate = new Date(dates.to)
          toDate.setHours(23, 59, 59, 999)
          if (toDate < paperDate) return false
        }
        return true
      })
    }

    // Apply sorting
    if (sort === "date") {
      filtered.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
    } else if (sort === "relevance" && search) {
      // Sort by relevance (how many keywords match)
      filtered.sort((a, b) => {
        const aMatches = a.keywords.filter((k) => k.toLowerCase().includes(search.toLowerCase())).length
        const bMatches = b.keywords.filter((k) => k.toLowerCase().includes(search.toLowerCase())).length
        return bMatches - aMatches
      })
    }

    setFilteredPapers(filtered)
  }

  const handlePaperAdded = (newPaper: Paper) => {
    const updatedPapers = [newPaper, ...papers]
    setPapers(updatedPapers)
    setIsUploadOpen(false)

    // Update all keywords
    const keywords = new Set<string>()
    updatedPapers.forEach((paper) => {
      paper.keywords.forEach((k) => keywords.add(k))
    })
    setAllKeywords(Array.from(keywords).sort())

    // Reapply filters with new paper
    applyFilters(searchTerm, selectedKeywords, sortBy, dateRange)
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedKeywords(new Set())
    setSortBy("date")
    setDateRange({ from: "", to: "" })
    setFilteredPapers(papers)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div className="flex items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <BookOpen className="w-8 h-8 text-cyan-500" />
            <div>
              <h1 className="text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text">
                ThesisAI
              </h1>
              <p className="text-xs text-muted-foreground">Welcome, {user?.fullName || "Scholar"}</p>
            </div>
          </motion.div>

          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 bg-transparent">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Section Header */}
        <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Your Uploaded Papers</h2>
              <p className="text-muted-foreground">
                {filteredPapers.length} of {papers.length} paper{papers.length !== 1 ? "s" : ""} shown
              </p>
            </div>
            <Button
              onClick={() => setIsUploadOpen(true)}
              className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 gap-2 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              Upload New Thesis
            </Button>
          </div>

          <SearchFilters
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
            selectedKeywords={selectedKeywords}
            onKeywordToggle={handleKeywordToggle}
            allKeywords={allKeywords}
            sortBy={sortBy}
            onSortChange={handleSort}
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
            onClearFilters={clearFilters}
          />
        </motion.div>

        {/* Papers Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin">
              <div className="w-12 h-12 border-4 border-border border-t-cyan-500 rounded-full"></div>
            </div>
          </div>
        ) : filteredPapers.length === 0 ? (
          <motion.div className="text-center py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No papers found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || selectedKeywords.size > 0 || dateRange.from || dateRange.to
                ? "Try adjusting your filters"
                : "Upload your first research paper to get started"}
            </p>
            {(searchTerm || selectedKeywords.size > 0 || dateRange.from || dateRange.to) && (
              <Button onClick={clearFilters} variant="outline" className="mr-2 bg-transparent">
                Clear filters
              </Button>
            )}
            {papers.length === 0 && (
              <Button onClick={() => setIsUploadOpen(true)} className="bg-gradient-to-r from-cyan-500 to-violet-500">
                Upload Paper
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {filteredPapers.map((paper, i) => (
              <PaperCard key={paper.id} paper={paper} index={i} />
            ))}
          </motion.div>
        )}
      </main>

      {/* Upload Modal */}
      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} onPaperAdded={handlePaperAdded} />
    </div>
  )
}
