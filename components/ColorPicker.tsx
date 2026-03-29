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
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm text-gray-600 font-medium shrink-0">底色：</span>

      {PRESETS.map((preset) => {
        const selected = preset.color.toLowerCase() === value.toLowerCase()
        return (
          <button
            key={preset.color}
            onClick={() => onChange(preset.color)}
            title={preset.label}
            className={`
              flex flex-col items-center gap-1 group
            `}
          >
            <span
              className={`
                w-10 h-10 rounded-full border-2 transition-all
                ${selected
                  ? 'border-blue-500 ring-2 ring-blue-300 scale-110'
                  : 'border-gray-300 hover:border-blue-400 hover:scale-105'}
                ${preset.color === '#FFFFFF' ? 'shadow-inner' : ''}
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
        <label
          className={`
            w-10 h-10 rounded-full border-2 cursor-pointer transition-all overflow-hidden
            ${!isPreset
              ? 'border-blue-500 ring-2 ring-blue-300 scale-110'
              : 'border-gray-300 hover:border-blue-400 hover:scale-105'}
          `}
          title="自定义颜色"
          style={{ backgroundColor: !isPreset ? value : undefined }}
        >
          {isPreset && (
            <span className="flex items-center justify-center w-full h-full text-lg">🎨</span>
          )}
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="opacity-0 w-0 h-0 absolute"
          />
        </label>
        <span className={`text-xs ${!isPreset ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
          自定义
        </span>
      </div>
    </div>
  )
}
