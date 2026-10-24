'use client';

interface SizeColorPickerProps {
  sizes?: string[];
  colors?: string[];
  selectedSize?: string;
  selectedColor?: string;
  onSelectSize: (size: string) => void;
  onSelectColor: (color: string) => void;
}

export default function SizeColorPicker({
  sizes = [],
  colors = [],
  selectedSize,
  selectedColor,
  onSelectSize,
  onSelectColor,
}: SizeColorPickerProps) {
  return (
    <div className="space-y-4">
      {/* Sizes */}
      {sizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-900">
              Select Size: <span className="text-primary-600 font-bold">{selectedSize || 'Choose'}</span>
            </span>
            <span className="text-xs text-gray-400">Standard BD Fit</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => onSelectSize(size)}
                  className={`min-w-[44px] h-11 px-3 rounded-lg text-sm font-medium border transition-all duration-200 ${
                    isSelected
                      ? 'bg-primary-600 text-white border-primary-600 shadow-sm shadow-primary-200 scale-105'
                      : 'bg-white text-gray-800 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Colors */}
      {colors.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-900">
              Select Color: <span className="text-primary-600 font-bold">{selectedColor || 'Choose'}</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {colors.map((color) => {
              const isSelected = selectedColor === color;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => onSelectColor(color)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'border-primary-600 bg-primary-50 text-primary-700 font-semibold ring-1 ring-primary-600'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-gray-300 inline-block"
                    style={{
                      backgroundColor:
                        color.toLowerCase() === 'red'
                          ? '#C41E3A'
                          : color.toLowerCase() === 'gold'
                          ? '#D4A017'
                          : color.toLowerCase() === 'black'
                          ? '#111827'
                          : color.toLowerCase() === 'white'
                          ? '#ffffff'
                          : color.toLowerCase() === 'blue'
                          ? '#2563eb'
                          : color.toLowerCase() === 'green'
                          ? '#16a34a'
                          : color.toLowerCase() === 'maroon'
                          ? '#800000'
                          : color.toLowerCase() === 'pink'
                          ? '#ec4899'
                          : '#9ca3af',
                    }}
                  />
                  <span>{color}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
