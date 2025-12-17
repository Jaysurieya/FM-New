"use client"

import { useState, useRef, useEffect } from "react"

export default function AgeScrollPicker({
  values = Array.from({ length: 100 }, (_, i) => i + 1), // 1-100 age
  onSelectionChange,
  label = "Years",
}) {
  const [selected, setSelected] = useState(1)

  const scrollRef = useRef(null)

  const itemHeight = 40
  const visibleItems = 5
  const containerHeight = itemHeight * visibleItems // 200px total height

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [])

  useEffect(() => {
    onSelectionChange?.(selected)
  }, [selected, onSelectionChange])

  const handleScroll = () => {
    if (!scrollRef.current) return

    const scrollTop = scrollRef.current.scrollTop
    const index = Math.round(scrollTop / itemHeight)
    const clampedIndex = Math.max(0, Math.min(index, values.length - 1))
    setSelected(values[clampedIndex])
  }

  const scrollToValue = (value) => {
    if (!scrollRef.current) return

    const index = values.indexOf(value)
    if (index !== -1) {
      scrollRef.current.scrollTo({
        top: index * itemHeight,
        behavior: "smooth",
      })
    }
  }

  const renderColumn = () => (
    <div className="relative flex flex-col items-center">
      <div className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">{label}</div>

      <button
        onClick={() => {
          const currentIndex = values.indexOf(selected)
          if (currentIndex > 0) {
            const newValue = values[currentIndex - 1]
            setSelected(newValue)
            scrollToValue(newValue)
          }
        }}
        className="mb-2 p-1 hover:bg-emerald-100 rounded-full transition-colors"
      >
        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>

      <div className="relative">
        {/* Selection indicator */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="w-20 h-10 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl border-2 border-emerald-400/30 backdrop-blur-[1px] shadow-sm" />
        </div>

        {/* Scroll container */}
        <div
          ref={scrollRef}
          className="overflow-y-scroll scrollbar-hide relative"
          style={{
            scrollSnapType: "y mandatory",
            paddingTop: `${itemHeight * 2}px`,
            paddingBottom: `${itemHeight * 2}px`,
            height: `${containerHeight}px`,
            width: "6rem",
          }}
          onScroll={handleScroll}
        >
          {values.map((value, index) => (
            <div
              key={value}
              className={`flex h-10 items-center justify-center text-xl font-bold transition-all duration-300 cursor-pointer select-none ${
                value === selected
                  ? "text-slate-900 scale-110 drop-shadow-sm font-extrabold z-20 relative"
                  : Math.abs(values.indexOf(selected) - index) === 1
                  ? "text-slate-700 scale-95"
                  : index > values.indexOf(selected)
                  ? "text-slate-400 scale-90 blur-[1px]"
                  : "text-slate-500 scale-90"
              }`}
              style={{
                scrollSnapAlign: "center",
                height: `${itemHeight}px`,
              }}
              onClick={() => {
                setSelected(value)
                scrollToValue(value)
              }}
            >
              {value.toString().padStart(2, "0")}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          const currentIndex = values.indexOf(selected)
          if (currentIndex < values.length - 1) {
            const newValue = values[currentIndex + 1]
            setSelected(newValue)
            scrollToValue(newValue)
          }
        }}
        className="mt-2 p-1 hover:bg-emerald-100 rounded-full transition-colors"
      >
        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  )

  return (
    <div className="flex items-center justify-center p-6">
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 px-20 py-10">
        {/* Decorative elements */}
        <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full opacity-60" />
        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full opacity-40" />

        {/* Scroll selector */}
        {renderColumn()}

        {/* Selected value display */}
        <div className="mt-6 text-center">
          <div className="text-sm text-slate-500 mb-1 font-medium">Selected Value</div>
          <div className="text-3xl font-bold text-emerald-600">
            {selected.toString().padStart(2, "0")} <span className="text-slate-500 text-xl ml-2">{label}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
