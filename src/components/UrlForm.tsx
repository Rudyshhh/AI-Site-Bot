"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert } from "@/components/ui/alert"

export default function UrlForm({
  urls,
  addUrl,
  clearUrls,
}: {
  urls: string[]
  addUrl: (url: string) => Promise<void>
  clearUrls: () => Promise<void>
}) {
  const [newUrl, setNewUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newUrl) {
      try {
        setIsLoading(true)
        setError("")
        await addUrl(newUrl)
        setNewUrl("")
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add URL")
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="space-y-4 mb-8">
      <h2 className="text-xl font-semibold">Input URLs</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="Enter a URL"
            required
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add URL"}
          </Button>
        </div>

        {error && <Alert variant="destructive">{error}</Alert>}
      </form>

      {urls.length > 0 && (
        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Added URLs:</h3>
            <ul className="space-y-2">
              {urls.map((url, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  {url}
                </li>
              ))}
            </ul>
          </div>
          <Button variant="outline" onClick={clearUrls}>
            Clear All URLs
          </Button>
        </div>
      )}
    </div>
  )
}

