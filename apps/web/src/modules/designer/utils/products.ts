import { PrintableProduct } from "../types/printable-product"

// mocked impressible product service
export const getProductById = (id: string): PrintableProduct => {
    return {
        id: 'coffee-cup',
        printableTemplateSrc: '/images/products/coffee-cup.pdf',
        printableArea: {
            x: 29,
            y: 119,
            // this is the size of the image in mm
            // 192.5mm x 128.5mm
            width: 192.5,
            height: 128.5,
        },
        model: {
            name: 'CoffeeCupModel',
            src: '/models/CoffeeCup.glb',
        },
        metadata: {}
    }
}