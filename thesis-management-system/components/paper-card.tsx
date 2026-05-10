"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Copy } from "lucide-react"

interface Paper {
  id: string
  abstract: string
  keywords: string[]
  uploadedAt: string
}

export default function PaperCard({ paper, index }: { paper: Paper; index: number }) {
  const handleCopyAbstract = () => {
    navigator.clipboard.writeText(paper.abstract)
  }

  return (
    <motion.div
      className="group p-6 rounded-xl border border-border bg-card hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      {/* Header */}
      <div className="mb-4 pb-4 border-b border-border">
        <p className="text-xs text-muted-foreground mb-2">Uploaded {new Date(paper.uploadedAt).toLocaleDateString()}</p>
      </div>

      {/* Abstract */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-muted-foreground">Abstract</h3>
          <button
            onClick={handleCopyAbstract}
            className="p-1.5 rounded hover:bg-secondary opacity-0 group-hover:opacity-100 transition-opacity"
            title="Copy abstract"
          >
            <Copy className="w-4 h-4 text-muted-foreground hover:text-foreground" />
          </button>
        </div>
        <p className="text-sm line-clamp-3 text-foreground leading-relaxed">{paper.abstract}</p>
      </div>

      {/* Keywords */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground mb-3">Keywords</p>
        <div className="flex flex-wrap gap-2">
          {paper.keywords.map((keyword, i) => (
            <Badge
              key={i}
              variant="secondary"
              className="bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 text-xs cursor-default"
            >
              {keyword}
            </Badge>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
