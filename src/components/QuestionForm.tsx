"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { askQuestion } from "@/lib/actions"
import { Alert } from "@/components/ui/alert"

export default function QuestionForm({ urls }: { urls: string[] }) {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (question && urls.length > 0) {
      try {
        setIsLoading(true)
        setError("")
        const result = await askQuestion(question)
        setAnswer(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Ask a Question</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question"
            required
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || urls.length === 0}>
            {isLoading ? "Loading..." : "Ask"}
          </Button>
        </div>

        {error && <Alert variant="destructive">{error}</Alert>}

        {answer && (
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Answer:</h3>
            <p className="whitespace-pre-wrap">{answer}</p>
          </div>
        )}
      </form>
    </div>
  )
}

