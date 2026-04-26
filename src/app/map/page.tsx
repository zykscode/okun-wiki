import InteractiveMap from "@/components/interactive-map"

export default function MapPage() {
  return (
    <div className="flex flex-col">
      <main className="flex-1 w-full relative p-4 lg:p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-display font-bold text-wiki-text mb-6">Interactive Map</h1>
        <div className="h-[70vh] min-h-[600px] w-full glass-card relative z-0">
          <InteractiveMap />
        </div>
      </main>
    </div>
  )
}
