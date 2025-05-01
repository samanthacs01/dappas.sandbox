'use client';
import { useRef, useState } from 'react';
import { Plus, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { Button } from '@/core/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/core/components/ui/tabs';
import { _styles, _colors } from '@/_mock/_packaging-style';
import { Card, CardContent } from '@/core/components/ui/card';
import { Separator } from '@/core/components/ui/separator';
import { cn } from '@/core/lib/utils';
import Image from 'next/image';

const InspirationButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStyles, setselectedStyles] = useState<string[]>([]);
  const [selectedColors, setselectedColors] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const addStyle = (style: string) => {
    if (selectedStyles.includes(style)) {
      setselectedStyles((prev) => prev.filter((s) => s !== style));
      return;
    }
    setselectedStyles((prev) => [...(prev || []), style]);
  };

  const addColor = (color: string) => {
    if (selectedColors.includes(color)) {
      setselectedColors((prev) => prev.filter((s) => s !== color));
      return;
    }
    setselectedColors((prev) => [...(prev || []), color]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImages((prev) => [event.target?.result as string, ...prev]);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="">
      <Button
        onClick={togglePanel}
        variant="outline"
        className="flex items-center justify-between cursor-pointer"
      >
        <span>Inspirations</span>
        <Plus
          className={`size-4 bg-violet-700 rounded-full text-white font-bold transition-transform ${
            isOpen ? 'rotate-45' : ''
          }`}
        />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden max-w-[600px]"
          >
            <Card className="mt-2 border shadow-sm !py-3">
              <CardContent className="!px-3">
                <Tabs defaultValue="estilos" className="w-full">
                  <TabsList className="flex justify-center bg-transparent gap-2 py-0">
                    <TabsTrigger
                      value="estilos"
                      className="flex items-center gap-2 shadow-none justify-start"
                    >
                      <span>Packaging Style</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="color"
                      className="flex items-center gap-2 justify-start"
                    >
                      <span>Theme Color</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="analisis"
                      className="flex items-center gap-2"
                    >
                      <span>Comparative Analysis</span>
                    </TabsTrigger>
                  </TabsList>
                  <Separator />
                  <TabsContent
                    value="estilos"
                    className="flex flex-col p-4 min-h-[400px] overflow-y-auto gap-2"
                  >
                    <p className="text-sm font-semibold">Recommended Styles</p>
                    <div className="flex flex-wrap gap-2">
                      {_styles.map((style) => (
                        <Button
                          key={style}
                          variant={'ghost'}
                          onClick={() => addStyle(style)}
                          className={clsx(
                            'bg-zinc-100 rounded-md !p-2 mb-2 text-center cursor-pointer hover:text-violet-700 transition scale-100 border border-transparent',
                            {
                              'border-violet-500':
                                selectedStyles.includes(style),
                            }
                          )}
                        >
                          <span className="text-xs">{style}</span>
                        </Button>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent
                    value="color"
                    className="min-h-[400px] overflow-y-auto gap-2"
                  >
                    <div className="grid grid-cols-7 auto-rows-min w-full overflow-y-auto gap-2 p-2">
                      {_colors.map((color, index) => (
                        <button
                          key={index}
                          onClick={() => addColor(color.color)}
                          className={cn(
                            `rounded-md h-10 text-center transition scale-100 border`,
                            color.color,
                            {
                              'border-violet-500': selectedColors.includes(
                                color.color
                              ),
                            }
                          )}
                        ></button>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent
                    value="analisis"
                    className="flex flex-col p-4 min-h-[400px] overflow-y-auto gap-2"
                  >
                    <div className="flex items-start">
                      <div className="flex flex-col w-full items-start gap-2">
                        <p className="text-xs font-semibold">
                          Upload Your Competitors Image
                        </p>
                        <button
                          onClick={triggerFileUpload}
                          className="size-20 border border-dashed border-violet-700 rounded-md flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                        >
                          <Upload className="size-8 text-violet-500" />
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept="image/*"
                            className="hidden"
                          />
                        </button>
                        <Separator className="my-2" />
                        {uploadedImages.map((image, index) => (
                          <div key={index} className="flex w-full py-1">
                            <div className="w-20 h-auto">
                              <Image
                                src={image}
                                alt="Imagen subida"
                                className="w-full h-auto object-cover rounded-md"
                                width={96}
                                height={96}
                                onError={(e) => {
                                  console.error('Error al cargar la imagen');
                                  (e.target as HTMLImageElement).style.display =
                                    'none';
                                }}
                              />
                            </div>
                            <div className="ml-4 text-sm">Image analysis</div>
                          </div>
                        ))}
                        <div className="mt-4">
                          <p className="text-xs font-semibold text-zinc-500">
                            example:
                          </p>
                          <div className="flex w-full">
                            <div className="w-20 h-auto">
                              <Image
                                src="/images/t-shirt/white-front.png"
                                alt="Imagen subida"
                                className="w-full h-auto object-cover rounded-md"
                                width={96}
                                height={96}
                              />
                            </div>
                            <div className="ml-4 text-sm">
                              An image of a white pullover.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InspirationButton;
