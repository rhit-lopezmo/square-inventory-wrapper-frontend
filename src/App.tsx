import React, { useState, useMemo, useEffect } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { AdjustmentCard } from '@/components/AdjustmentCard';
import { Button } from '@/components/Button';
import { MOCK_PRODUCTS } from '@/constants';
import { Product, InventoryChange } from '@/types';
import { fuzzyMatch, cn } from '@/utils';
import { fetchInventory, updateProductStock } from '@/api';
import { useAuth } from '@/auth';
import { Package, ChevronRight, CheckCircle2, AlertCircle, ArrowRight, LogOut } from 'lucide-react';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingInventory, setIsLoadingInventory] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [adjustments, setAdjustments] = useState<Record<string, number>>({});
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { user, logout } = useAuth();

  // Load inventory from backend; fall back to mock data if unavailable
  useEffect(() => {
    let cancelled = false;

    const loadInventory = async () => {
      setIsLoadingInventory(true);
      try {
        const data = await fetchInventory();
        if (cancelled) return;
        setProducts(data);
        setLoadError(null);
      } catch (error) {
        console.error('Failed to load inventory', error);
        if (cancelled) return;
        setLoadError('Using mock data because the inventory API is unavailable.');
        setProducts(MOCK_PRODUCTS);
      } finally {
        if (!cancelled) setIsLoadingInventory(false);
      }
    };

    loadInventory();
    return () => { cancelled = true; };
  }, []);

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return []; // Don't show list if no search (optional, allows cleaner UI)
    // Actually, user often wants to browse. Let's show all if empty, or filter.
    // Given the prompt "search on them", let's show all if empty but allow filtering.
    // However, for "Selecting" workflow, it's cleaner to show suggestions.

    return products.filter(p =>
      fuzzyMatch(searchTerm, p.name) ||
      fuzzyMatch(searchTerm, p.sku) ||
      fuzzyMatch(searchTerm, p.category)
    );
  }, [searchTerm, products]);

  const handleSelectProduct = (product: Product) => {
    setSearchTerm(''); // Clear search on select to return to workspace view
    setSelectedProductIds(prev => {
      const next = new Set(prev);
      next.add(product.id);
      return next;
    });
    // Initialize adjustment if not present
    if (adjustments[product.id] === undefined) {
      setAdjustments(prev => ({ ...prev, [product.id]: 0 }));
    }
  };

  const handleUpdateDelta = (id: string, delta: number) => {
    setAdjustments(prev => ({ ...prev, [id]: delta }));
  };

  const handleRemoveSelection = (id: string) => {
    setSelectedProductIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setAdjustments(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate API call
    const changes: InventoryChange[] = Object.entries(adjustments)
      .filter(([_, delta]) => delta !== 0) // Only send actual changes
      .map(([productId, delta]) => ({ productId, delta }));

    if (changes.length === 0) {
      setIsSubmitting(false);
      return;
    }

    try {
      const updates = await Promise.all(changes.map(async ({ productId, delta }) => {
        const product = products.find(p => p.id === productId);
        if (!product) return null;
        const updated = await updateProductStock(product.sku, { currentStock: product.currentStock + delta });
        return { id: product.id, product: updated };
      }));

      const updatesMap = new Map<string, Product>();
      updates.forEach(entry => {
        if (entry) updatesMap.set(entry.id, entry.product);
      });

      setProducts(prev => prev.map(p => updatesMap.get(p.id) ?? p));
      setSubmitStatus('success');

      // Reset after success
      setTimeout(() => {
        setSubmitStatus('idle');
        setAdjustments({});
        setSelectedProductIds(new Set());
      }, 2000);
    } catch (error) {
      console.error('Failed to submit inventory updates', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to sign out', error);
    }
  };

  // Derived state for the workspace
  const selectedProducts = Array.from(selectedProductIds)
    .map(id => products.find(p => p.id === id))
    .filter((p): p is Product => !!p)
    .map(p => ({
      ...p,
      pendingDelta: adjustments[p.id] || 0
    }));

  const totalChanges = Object.values(adjustments).filter(d => d !== 0).length;

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-32">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-black text-white p-2 rounded-lg">
              <Package size={20} />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-gray-900">Inventory<span className="text-gray-400 font-normal">Manager</span></h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full border border-gray-200">
              <div className="h-9 w-9 rounded-full bg-black text-white flex items-center justify-center font-semibold uppercase">
                {user?.email?.charAt(0).toUpperCase() ?? 'U'}
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-[11px] uppercase tracking-[0.15em] text-gray-500">Signed in</span>
                <span className="text-sm font-semibold text-gray-900 max-w-[180px] truncate">{user?.email ?? 'User'}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="border border-gray-200 text-gray-700 hover:bg-gray-100"
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-2" />
              <span className="hidden sm:inline">Sign out</span>
              <span className="sm:hidden">Exit</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-6">

        {/* Search Section */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">Find Product</label>
          <SearchBar value={searchTerm} onChange={setSearchTerm} />

          {isLoadingInventory && (
            <div className="mt-3 text-sm text-gray-500">Loading inventory...</div>
          )}

          {loadError && (
            <div className="mt-3 flex items-center gap-2 text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
              <AlertCircle size={16} />
              <span>{loadError}</span>
            </div>
          )}

          {/* Search Results Dropdown/List */}
          {searchTerm && (
            <div className="mt-2 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden absolute w-[calc(100%-2rem)] max-w-3xl z-10">
              {isLoadingInventory ? (
                <div className="p-4 text-center text-gray-500">Loading inventory...</div>
              ) : filteredProducts.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No products found matching "{searchTerm}"</div>
              ) : (
                <ul className="divide-y divide-gray-100 max-h-[60vh] overflow-y-auto">
                  {filteredProducts.map(product => (
                    <li
                      key={product.id}
                      onClick={() => handleSelectProduct(product)}
                      className="p-4 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors active:bg-gray-100"
                    >
                      <img src={product.imageUrl} alt="" className="w-10 h-10 rounded bg-gray-200 object-cover" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.sku}</div>
                      </div>
                      <div className="text-sm text-gray-400">
                        Stock: {product.currentStock}
                      </div>
                      <ChevronRight size={16} className="text-gray-300" />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Selected / Workspace Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Pending Changes</h2>
            {selectedProducts.length > 0 && (
              <button
                onClick={() => { setSelectedProductIds(new Set()); setAdjustments({}); }}
                className="text-xs text-red-600 hover:text-red-700 font-medium"
              >
                Clear All
              </button>
            )}
          </div>

          {selectedProducts.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
              <div className="mx-auto h-12 w-12 text-gray-300 mb-3">
                <Package size={48} strokeWidth={1} />
              </div>
              <h3 className="text-gray-900 font-medium">No items selected</h3>
              <p className="text-gray-500 text-sm mt-1">Search for a product above to adjust inventory.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedProducts.map(product => (
                <AdjustmentCard
                  key={product.id}
                  item={product}
                  onUpdateDelta={handleUpdateDelta}
                  onRemove={handleRemoveSelection}
                />
              ))}
            </div>
          )}
        </div>

      </main>

      {/* Sticky Bottom Action Bar */}
      <div className={cn(
        "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] transition-transform duration-300 ease-in-out z-30",
        selectedProducts.length > 0 ? "translate-y-0" : "translate-y-full"
      )}>
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Summary</span>
            <span className="font-bold text-gray-900">{totalChanges} items modified</span>
          </div>

          <div className="flex-1 flex justify-end">
            {submitStatus === 'success' ? (
              <Button className="bg-green-600 hover:bg-green-700 text-white cursor-default">
                <CheckCircle2 className="mr-2" size={20} />
                Updated!
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || totalChanges === 0}
                className="w-full sm:w-auto min-w-[160px]"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Updating...</span>
                ) : (
                  <>
                    Update Inventory <ArrowRight className="ml-2" size={18} />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
