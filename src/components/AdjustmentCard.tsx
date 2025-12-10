import React from 'react';
import { Minus, Plus, X, ArrowRight } from 'lucide-react';
import { ProductWithChange } from '@/types';
import { Button } from '@/components/Button';
import { cn } from '@/utils';

interface AdjustmentCardProps {
  item: ProductWithChange;
  onUpdateDelta: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

export const AdjustmentCard: React.FC<AdjustmentCardProps> = ({ item, onUpdateDelta, onRemove }) => {
  const finalStock = item.currentStock + item.pendingDelta;
  const isNegative = item.pendingDelta < 0;
  const isPositive = item.pendingDelta > 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4 flex flex-col sm:flex-row sm:items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">

      {/* Product Info Section */}
      <div className="flex items-start gap-4 flex-1">
        <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
          <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-gray-900 truncate pr-2">{item.name}</h3>
            {/* Mobile-only Remove Button */}
            <button
              onClick={() => onRemove(item.id)}
              className="sm:hidden text-gray-400 hover:text-red-600 p-1 -mt-1 -mr-2"
              aria-label="Remove item"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-sm text-gray-500 truncate">{item.sku}</p>
          <div className="mt-1 flex items-center gap-2 text-sm">
            <span className="text-gray-500">In Stock: {item.currentStock}</span>
            {item.pendingDelta !== 0 && (
              <span className={cn(
                "font-medium flex items-center",
                isPositive ? "text-green-600" : "text-red-600"
              )}>
                <ArrowRight size={14} className="mx-1" /> {finalStock}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2 flex-1 sm:flex-none">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 bg-white shadow-sm border border-gray-200 text-black hover:bg-gray-50"
            onClick={() => onUpdateDelta(item.id, item.pendingDelta - 1)}
          >
            <Minus size={20} />
          </Button>

          <div className="flex flex-col items-center justify-center w-24">
            <span className={cn(
              "text-xl font-bold font-mono",
              item.pendingDelta === 0 && "text-gray-400",
              isPositive && "text-green-600",
              isNegative && "text-red-600"
            )}>
              {item.pendingDelta > 0 ? `+${item.pendingDelta}` : item.pendingDelta}
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 bg-black text-white hover:bg-gray-800 shadow-sm"
            onClick={() => onUpdateDelta(item.id, item.pendingDelta + 1)}
          >
            <Plus size={20} />
          </Button>
        </div>

        {/* Desktop-only Remove Button */}
        <button
          onClick={() => onRemove(item.id)}
          className="hidden sm:flex flex-shrink-0 h-10 w-10 items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Remove item"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};
