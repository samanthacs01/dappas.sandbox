import { getProducts } from '@/server/shopify';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@workspace/ui/components/card';
import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
  const products = await getProducts({ first: 10 });
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-3 gap-4 w-full">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle>{product.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Image
                  src={
                    product.featuredImage?.url ||
                    'https://via.placeholder.com/400x400'
                  }
                  alt={product.featuredImage?.altText || ''}
                  width={400}
                  height={400}
                />
                <p>{product.description}</p>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href={`/products/${product.handle}`}>View</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
