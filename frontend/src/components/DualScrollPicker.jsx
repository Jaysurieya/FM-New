"use client"

import { useState, useRef, useEffect } from "react"

export default function DualScrollPicker_weight({
  leftValues = Array.from({ length: 200 }, (_, i) => i), // 0-199 kg
  rightValues = Array.from({ length: 10 }, (_, i) => i), // 0-9 for decimal
  onSelectionChange,
  leftLabel = "kg",
  rightLabel = "decimal",
}) {
  const [leftSelected, setLeftSelected] = useState(0)
  const [rightSelected, setRightSelected] = useState(0)

  const leftScrollRef = useRef(null)
  const rightScrollRef = useRef(null)

  const itemHeight = 40
  const visibleItems = 5
  const containerHeight = itemHeight * visibleItems // 200px total height

  useEffect(() => {
    if (leftScrollRef.current) {
      leftScrollRef.current.scrollTop = 0
    }
    if (rightScrollRef.current) {
      rightScrollRef.current.scrollTop = 0
    }
  }, [])

  useEffect(() => {
    onSelectionChange?.(leftSelected, rightSelected)
  }, [leftSelected, rightSelected, onSelectionChange])

  const handleScroll = (scrollRef, values, setSelected) => {
    if (!scrollRef.current) return

    const scrollTop = scrollRef.current.scrollTop
    const index = Math.round(scrollTop / itemHeight)
    const clampedIndex = Math.max(0, Math.min(index, values.length - 1))
    setSelected(values[clampedIndex])
  }

  const scrollToValue = (scrollRef, values, value) => {
    if (!scrollRef.current) return

    const index = values.indexOf(value)
    if (index !== -1) {
      scrollRef.current.scrollTo({
        top: index * itemHeight,
        behavior: "smooth",
      })
    }
  }

  const renderColumn = (values, selected, scrollRef, setSelected, label) => (
    <div className="relative flex flex-col items-center">
      <div className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">{label}</div>

      <button
        onClick={() => {
          const currentIndex = values.indexOf(selected)
          if (currentIndex > 0) {
            const newValue = values[currentIndex - 1]
            setSelected(newValue)
            scrollToValue(scrollRef, values, newValue)
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
          onScroll={() => handleScroll(scrollRef, values, setSelected)}
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
                scrollToValue(scrollRef, values, value)
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
            scrollToValue(scrollRef, values, newValue)
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
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 px-32 py-10">
        {/* Decorative elements */}
        <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full opacity-60" />
        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full opacity-40" />

        <div className="flex items-center gap-6">
          {/* Left column */}
          {renderColumn(leftValues, leftSelected, leftScrollRef, setLeftSelected, leftLabel)}

          {/* Separator */}
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mb-2" />
            <div className="w-1 h-16 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-full opacity-60" />
            <div className="w-3 h-3 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mt-2" />
          </div>

          {/* Right column */}
          {renderColumn(rightValues, rightSelected, rightScrollRef, setRightSelected, rightLabel)}
        </div>

        {/* Selected values display */}
        <div className="mt-6 text-center">
          <div className="text-sm text-slate-500 mb-1 font-medium">Weight</div>
          <div className="text-3xl font-bold text-emerald-600">
            {leftSelected.toString().padStart(2, "0")}
            <span className="text-slate-400 mx-1">.</span>
            {rightSelected.toString()}
            <span className="text-slate-500 text-xl ml-2">{leftLabel}</span>
          </div>
        </div>

        {/* Gradient overlays for fade effect */}
        <div className="absolute top-6 left-6 right-6 h-12 bg-gradient-to-b from-white to-transparent pointer-events-none rounded-t-3xl" />
        <div className="absolute bottom-6 left-6 right-6 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-b-3xl" />
      </div>
    </div>
  )
}
