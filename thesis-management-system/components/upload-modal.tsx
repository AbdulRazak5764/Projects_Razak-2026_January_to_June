"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, UploadIcon, Loader } from "lucide-react"

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onPaperAdded: (paper: any) => void
}

export default function UploadModal({ isOpen, onClose, onPaperAdded }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [abstract, setAbstract] = useState("")
  const [keywords, setKeywords] = useState("")
  const [error, setError] = useState("")
  const [step, setStep] = useState<"upload" | "review">("upload")

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a PDF file")
      return
    }

    setError("")
    setFile(selectedFile)
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

      const response = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setAbstract(data.abstract)
        setKeywords(data.keywords.join(", "))
        setStep("review")
      } else {
        setError("Failed to extract PDF content. Please try again.")
      }
    } catch (err) {
      setError("Error processing PDF")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!file || !abstract || !keywords) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("abstract", abstract)
      formData.append("keywords", keywords)

      const response = await fetch("/api/papers", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const newPaper = await response.json()
        onPaperAdded(newPaper)
        resetForm()
      } else {
        setError("Failed to save paper")
      }
    } catch (err) {
      setError("Error saving paper")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFile(null)
    setAbstract("")
    setKeywords("")
    setError("")
    setStep("upload")
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={resetForm}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
          >
            <div className="bg-card border border-border rounded-2xl p-8 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={resetForm}
                className="absolute top-4 right-4 p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {step === "upload" ? (
                <>
                  <h2 className="text-2xl font-bold mb-2">Upload Research Paper</h2>
                  <p className="text-muted-foreground text-sm mb-6">
                    Upload a PDF file and we'll extract the abstract and keywords using AI
                  </p>

                  <div className="mb-6">
                    <label className="flex items-center justify-center w-full p-8 border-2 border-dashed border-border rounded-xl hover:border-cyan-500/50 transition-colors cursor-pointer group">
                      <div className="text-center">
                        <UploadIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground group-hover:text-cyan-500 transition-colors" />
                        <p className="font-medium mb-1">{file ? file.name : "Click to upload PDF"}</p>
                        {!file && <p className="text-xs text-muted-foreground">or drag and drop</p>}
                      </div>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={loading}
                      />
                    </label>
                  </div>

                  {loading && (
                    <div className="flex items-center justify-center gap-2 text-cyan-500">
                      <Loader className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Analyzing PDF...</span>
                    </div>
                  )}

                  {error && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                      {error}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-2">Review Extracted Content</h2>
                  <p className="text-muted-foreground text-sm mb-6">Edit the abstract and keywords if needed</p>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Abstract</label>
                      <textarea
                        value={abstract}
                        onChange={(e) => setAbstract(e.target.value)}
                        className="w-full p-3 bg-secondary/50 border border-border rounded-lg text-sm min-h-24 resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Keywords (comma-separated)</label>
                      <Input
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        placeholder="keyword1, keyword2, keyword3"
                        className="bg-secondary/50"
                      />
                    </div>

                    {error && (
                      <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                        {error}
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setStep("upload")
                          setFile(null)
                          setAbstract("")
                          setKeywords("")
                        }}
                        disabled={loading}
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600"
                      >
                        {loading ? "Saving..." : "Save Paper"}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
