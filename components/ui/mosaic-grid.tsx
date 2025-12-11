'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface MosaicGridProps {
  className?: string
}

export const MosaicGrid = ({ className }: MosaicGridProps) => {
  const [tiles, setTiles] = useState<any[]>([])

  useEffect(() => {
    // Generate a deterministic but "random-looking" set of tiles
    // We'll use a simple filling algorithm or just a predefined robust layout for the strip
    const newTiles = []
    const colors = [
      'bg-orange-400/80',
      'bg-orange-500/80',
      'bg-amber-400/80',
      'bg-rose-400/80',
      'bg-slate-200/80', 
      'bg-slate-300/80',
      'bg-red-400/80'
    ]

    // Create a deterministic brick pattern (running bond)
    // Grid matches grid-cols-12 (mobile) and grid-cols-24 (desktop)
    // We treat 'desktop' as the main logical width for generation (24 cols)
    // Bricks are 2 cols wide.
    // Even rows: 12 bricks of width 2
    // Odd rows: 1 brick width 1, 11 bricks width 2, 1 brick width 1
    
    // We'll generate enough rows to fill the height (approx 4-6 rows depending on aspect ratio, but we hardcode a safe amount)
    const rows = 6 
    let idCounter = 0

    for (let r = 0; r < rows; r++) {
       const isEven = r % 2 === 0
       
       if (isEven) {
          // 12 full bricks (spanning 24 cols total)
          for (let c = 0; c < 12; c++) {
              newTiles.push({
                  id: idCounter++,
                  colSpan: 'col-span-2', // On mobile this is 1/6th width, on desktop 1/12th
                  rowSpan: 'row-span-1',
                  color: colors[Math.floor(Math.random() * colors.length)],
                  delay: (r * 0.1) + (c * 0.05) // Wave effect delay
              })
          }
       } else {
           // Odd row: Staggered
           // Start half brick
           newTiles.push({
               id: idCounter++,
               colSpan: 'col-span-1',
               rowSpan: 'row-span-1',
               color: colors[Math.floor(Math.random() * colors.length)],
               delay: (r * 0.1)
           })
           // Middle full bricks (11 bricks = 22 cols)
           for (let c = 0; c < 11; c++) {
               newTiles.push({
                   id: idCounter++,
                   colSpan: 'col-span-2',
                   rowSpan: 'row-span-1',
                   color: colors[Math.floor(Math.random() * colors.length)],
                   delay: (r * 0.1) + ((c + 0.5) * 0.05)
               })
           }
           // End half brick
           newTiles.push({
               id: idCounter++,
               colSpan: 'col-span-1',
               rowSpan: 'row-span-1',
               color: colors[Math.floor(Math.random() * colors.length)],
               delay: (r * 0.1) + (12 * 0.05)
           })
       }
    }

    setTiles(newTiles)
  }, [])

  return (
    <div className={cn("w-full h-full overflow-hidden", className)}>
      <div className="grid grid-cols-12 md:grid-cols-24 grid-rows-4 gap-[1px] w-full h-full bg-slate-900/5 p-[1px]">
        {tiles.map((tile) => (
          <motion.div
            key={tile.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: tile.delay * 0.1 }}
            className={cn(
              "relative rounded-[1px] border border-white/10 backdrop-blur-sm transition-colors duration-500 hover:brightness-110",
              tile.colSpan,
              tile.rowSpan,
              tile.color
            )}
          />
        ))}
      </div>
    </div>
  )
}
