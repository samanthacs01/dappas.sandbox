import ProductDesigner from "@/modules/designer/containers/product-designer"

type Params = {
    product: string
}

export default async function Home({params}: {params: Promise<Params>}) {
    const {product} = await params
    return <ProductDesigner productId={product}/>
}