"use client"

import { useState, useEffect } from "react"
import UrlForm from "@/components/UrlForm"
import QuestionForm from "@/components/QuestionForm"
import { getUrls, addUrl, clearUrls } from "@/lib/actions"

export default function Home() {
  const [urls, setUrls] = useState<string[]>([])

  useEffect(() => {
    async function fetchUrls() {
      const storedUrls = await getUrls()
      setUrls(storedUrls)
    }
    fetchUrls()
  }, [])

  const handleAddUrl = async (url: string) => {
    await addUrl(url)
    setUrls((prevUrls) => [...prevUrls, url])
  }

  const handleClearUrls = async () => {
    await clearUrls()
    setUrls([])
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Web Content Q&A Tool</h1>
      <UrlForm urls={urls} addUrl={handleAddUrl} clearUrls={handleClearUrls} />
      <QuestionForm urls={urls} />
    </main>
  )
}
