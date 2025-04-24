import { EmptyPlaceholder } from "@/core/components/ui/empty-placeholder"
import { Construction } from 'lucide-react'

export default function ProductionContainer() {
  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-background">
      <EmptyPlaceholder
        icon={Construction}
        title="Under Construction"
        description="We're working hard to bring you this feature. Check back soon!"
        className="p-4"
      >
      </EmptyPlaceholder>
    </div>
  )
}

