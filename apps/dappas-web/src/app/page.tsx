import { getProducts } from '@/server/shopify';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Palette, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default async function Home() {
  const products = await getProducts({ first: 10 });
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            Welcome to Our MVP
          </h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Choose one of the options below to get started the demos
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg py-0">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 pb-8 pt-6 text-white">
              <CardTitle className="text-center text-2xl">
                Design Studio
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col items-center justify-between p-6 pt-10">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-purple-100 text-purple-500 dark:bg-purple-900/30">
                <Palette size={48} />
              </div>
              <CardDescription className="mb-6 text-center text-base">
                Access our powerful design tools and create beautiful graphics
                with ease
              </CardDescription>
            </CardContent>
            <CardFooter className="flex justify-center p-6 pt-0">
              <Button
                asChild
                size="lg"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              >
                <Link href="/canva/3d-view">Open Design Studio</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Onboarding Card */}
          <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg py-0">
            <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-500 pb-8 pt-6 text-white">
              <CardTitle className="text-center text-2xl">
                Get Started
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col items-center justify-between p-6 pt-10">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-blue-500 dark:bg-blue-900/30">
                <UserPlus size={48} />
              </div>
              <CardDescription className="mb-6 text-center text-base">
                Complete your account setup and personalize your experience
              </CardDescription>
            </CardContent>
            <CardFooter className="flex justify-center p-6 pt-0">
              <Button
                asChild
                size="lg"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
              >
                <Link href="/onboarding">Start Onboarding</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
