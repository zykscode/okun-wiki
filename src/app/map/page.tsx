import InteractiveMap from "@/components/interactive-map"

export default function MapPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 w-full relative p-4 container mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Interactive Map</h1>
        <div className="h-[600px] w-full border rounded-xl overflow-hidden shadow-lg bg-white relative z-0">
          <InteractiveMap />
        </div>
      </main>
    </div>
  )
}
