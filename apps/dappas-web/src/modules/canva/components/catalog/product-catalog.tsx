"use client"

import { Card, CardContent } from "@workspace/ui/components/card"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import Image from "next/image"
import { useState } from "react"

type Product = {
  id: string
  name: string
  type: "tshirt" | "mug" | "sweater"
  image: string
  defaultColor: string
}

const products: Product[] = [
  {
    id: "tshirt-1",
    name: "Classic T-Shirt",
    type: "tshirt",
    image: "/placeholder.svg?height=200&width=200",
    defaultColor: "#FFFFFF",
  },
  {
    id: "mug-1",
    name: "Ceramic Mug",
    type: "mug",
    image: "/placeholder.svg?height=200&width=200",
    defaultColor: "#FFFFFF",
  },
  {
    id: "pullover-1",
    name: "Classic Pullover",
    type: "sweater",
    image: "/placeholder.svg?height=200&width=200",
    defaultColor: "#3B82F6",
  },
  {
    id: "tshirt-2",
    name: "V-Neck T-Shirt",
    type: "tshirt",
    image: "/placeholder.svg?height=200&width=200",
    defaultColor: "#000000",
  },
  {
    id: "sweater-1",
    name: "Hoodie",
    type: "sweater",
    image: "/placeholder.svg?height=200&width=200",
    defaultColor: "#EF4444",
  },
]

interface ProductCatalogProps {
  selectedProduct: Product
  onSelectProduct: (product: Product) => void
}

export default function ProductCatalog({ selectedProduct, onSelectProduct }: ProductCatalogProps) {
  const [filter, setFilter] = useState<"all" | "tshirt" | "mug" | "sweater">("all")

  const filteredProducts = filter === "all" ? products : products.filter((product) => product.type === filter)

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Product Catalog</h3>

      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 text-sm rounded-full ${
            filter === "all" ? "bg-primary text-primary-foreground" : "bg-muted"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("tshirt")}
          className={`px-3 py-1 text-sm rounded-full ${
            filter === "tshirt" ? "bg-primary text-primary-foreground" : "bg-muted"
          }`}
        >
          T-Shirts
        </button>
        <button
          onClick={() => setFilter("mug")}
          className={`px-3 py-1 text-sm rounded-full ${
            filter === "mug" ? "bg-primary text-primary-foreground" : "bg-muted"
          }`}
        >
          Mugs
        </button>
        <button
          onClick={() => setFilter("sweater")}
          className={`px-3 py-1 text-sm rounded-full ${
            filter === "sweater" ? "bg-primary text-primary-foreground" : "bg-muted"
          }`}
        >
          Sweaters
        </button>
      </div>

      <ScrollArea className="h-[300px]">
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedProduct.id === product.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => onSelectProduct(product)}
            >
              <CardContent className="p-3">
                <div className="aspect-square relative mb-2 bg-muted rounded-md overflow-hidden">
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                </div>
                <p className="text-sm font-medium text-center">{product.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

