"use client"

interface ColorSelectorProps {
  selectedColor: string
  onSelectColor: (color: string) => void
}

const predefinedColors = [
  "#FFFFFF", // White
  "#000000", // Black
  "#3B82F6", // Blue
  "#EF4444", // Red
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#6B7280", // Gray
  "#78350F", // Brown
]

export default function ColorSelector({ selectedColor, onSelectColor }: ColorSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-2">
        {predefinedColors.map((color) => (
          <button
            key={color}
            className={`w-10 h-10 rounded-full border-2 ${
              selectedColor === color ? "border-primary" : "border-gray-200"
            }`}
            style={{ backgroundColor: color }}
            onClick={() => onSelectColor(color)}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>

      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full border border-gray-300" style={{ backgroundColor: selectedColor }} />
        <input type="color" value={selectedColor} onChange={(e) => onSelectColor(e.target.value)} className="w-full" />
      </div>
    </div>
  )
}

