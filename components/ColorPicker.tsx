'use client'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
}

const PRESETS = [
  { label: '红底', color: '#E60012' },
  { label: '蓝底', color: '#1E3FA0' },
  { label: '白底', color: '#FFFFFF' },
  { label: '深蓝', color: '#060B27' },
]

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  const isPreset = PRESETS.some(p => p.color.toLowerCase() === value.toLowerCase())

  return (
    <div className="flex flex-wrap items-center gap-4">
      <span className="text-sm text-gray-600 font-medium shrink-0">底色选择：</span>

      {PRESETS.map((preset) => {
        const selected = preset.color.toLowerCase() === value.toLowerCase()
        return (
          <button
            key={preset.color}
            onClick={() => onChange(preset.color)}
            title={preset.label}
            className="flex flex-col items-center gap-1"
          >
            <span
              className={`
                block w-10 h-10 rounded-full border-2 transition-all duration-150
                ${selected
                  ? 'border-blue-500 ring-2 ring-blue-300 scale-110'
                  : 'border-gray-300 hover:border-blue-400 hover:scale-105'}
                ${preset.color === '#FFFFFF' ? 'shadow-sm' : ''}
              `}
              style={{ backgroundColor: preset.color }}
            />
            <span className={`text-xs ${selected ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
              {preset.label}
            </span>
          </button>
        )
      })}

      {/* 自定义颜色 */}
      <div className="flex flex-col items-center gap-1">
        <div
          className={`
            relative w-10 h-10 rounded-full border-2 cursor-pointer transition-all duration-150 overflow-hidden
            ${!isPreset
              ? 'border-blue-500 ring-2 ring-blue-300 scale-110'
              : 'border-gray-300 hover:border-blue-400 hover:scale-105'}
          `}
          style={{ backgroundColor: !isPreset ? value : '#f3f4f6' }}
          title="自定义颜色"
        >
          {isPreset && (
            <span className="absolute inset-0 flex items-center justify-center text-lg pointer-events-none">🎨</span>
          )}
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <span className={`text-xs ${!isPreset ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
          自定义
        </span>
      </div>
    </div>
  )
}
