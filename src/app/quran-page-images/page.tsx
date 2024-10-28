'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Book } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import surahsData from '@/data/surah.json'
import parasData from '@/data/para.json'

interface Surah {
  number: number
  name: string
  englishName: string
  verses: number
  revelationPlace: string
  totalPages: number
}

interface Para {
  number: number
  name: string
  totalPages: number
}

const surahs: Surah[] = surahsData
const paras: Para[] = parasData

export default function QuranViewer() {
  const [selectedSurah, setSelectedSurah] = useState<Surah>(surahs[0])
  const [selectedPara, setSelectedPara] = useState<Para>(paras[0])
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'surah' | 'para'>('surah')

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedSurah, selectedPara, viewMode])

  const handleNext = () => {
    const maxPages = viewMode === 'surah' ? selectedSurah.totalPages : selectedPara.totalPages
    setCurrentPage(prev => Math.min(prev + 1, maxPages))
  }

  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  const imagePath = viewMode === 'surah'
    ? `/assets/surah-images/${selectedSurah.name}/${currentPage}.png`
    : `/assets/para-images/${selectedPara.number}/${currentPage}.png`

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-500">
      <header className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-amber-200 dark:border-slate-700 shadow-md">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center text-amber-800 dark:text-amber-200">
            <Book className="mr-2" aria-hidden="true" /> Read Quran
          </h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="w-full mx-auto bg-white dark:bg-slate-800 shadow-lg border-amber-200 dark:border-slate-700">
          <CardContent className="p-6 space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="flex items-center space-x-4 flex-wrap gap-4">
                <div>
                  <Label htmlFor="view-mode" className="text-amber-800 dark:text-amber-200">View Mode</Label>
                  <Select
                    value={viewMode}
                    onValueChange={(value: 'surah' | 'para') => setViewMode(value)}
                  >
                    <SelectTrigger id="view-mode" className="w-[180px] border-amber-300 dark:border-slate-600">
                      <SelectValue placeholder="Select view mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="surah">Surah</SelectItem>
                      <SelectItem value="para">Para</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {viewMode === 'surah' ? (
                  <div>
                    <Label htmlFor="surah-select" className="text-amber-800 dark:text-amber-200">Surah</Label>
                    <Select
                      value={selectedSurah.name}
                      onValueChange={(value) => {
                        const surah = surahs.find(s => s.name === value)
                        if (surah) setSelectedSurah(surah)
                      }}
                    >
                      <SelectTrigger id="surah-select" className="w-[180px] border-amber-300 dark:border-slate-600">
                        <SelectValue placeholder="Select a Surah" />
                      </SelectTrigger>
                      <SelectContent>
                        {surahs.map((surah) => (
                          <SelectItem key={surah.number} value={surah.name}>
                            {surah.number}. {surah.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="para-select" className="text-amber-800 dark:text-amber-200">Para</Label>
                    <Select
                      value={selectedPara.number.toString()}
                      onValueChange={(value) => {
                        const para = paras.find(p => p.number === parseInt(value))
                        if (para) setSelectedPara(para)
                      }}
                    >
                      <SelectTrigger id="para-select" className="w-[180px] border-amber-300 dark:border-slate-600">
                        <SelectValue placeholder="Select a Para" />
                      </SelectTrigger>
                      <SelectContent>
                        {paras.map((para) => (
                          <SelectItem key={para.number} value={para.number.toString()}>
                            {para.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="icon"
                  className="border-amber-300 dark:border-slate-600 text-amber-800 dark:text-amber-200"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  Page {currentPage} of {viewMode === 'surah' ? selectedSurah.totalPages : selectedPara.totalPages}
                </span>
                <Button
                  onClick={handleNext}
                  disabled={currentPage === (viewMode === 'surah' ? selectedSurah.totalPages : selectedPara.totalPages)}
                  variant="outline"
                  size="icon"
                  className="border-amber-300 dark:border-slate-600 text-amber-800 dark:text-amber-200"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="relative w-full" style={{ height: 'calc(100vh - 250px)' }}>
              <Image
                src={imagePath}
                alt={`${viewMode === 'surah' ? selectedSurah.name : selectedPara.name} - Page ${currentPage}`}
                layout="fill"
                objectFit="contain"
                priority
              />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}