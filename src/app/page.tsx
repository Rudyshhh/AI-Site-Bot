import UrlForm from "@/components/UrlForm"
import QuestionForm from "@/components/QuestionForm"
import { getUrls, addUrl, clearUrls } from "@/lib/actions"

export default async function Home() {
  const urls = await getUrls()

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Web Content Q&A Tool</h1>
      <UrlForm urls={urls} addUrl={addUrl} clearUrls={clearUrls} />
      <QuestionForm urls={urls} />
    </main>
  )
}

