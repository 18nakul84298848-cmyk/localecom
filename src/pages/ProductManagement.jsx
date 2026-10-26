// ==============================================================================
// DukaanConnect: Product Management Page
// Full CRUD, live validation, image uploading, and delete confirmation modal
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Upload, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  ShoppingBag, 
  ExternalLink,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { productsService } from '../services/products';
import { CATEGORIES, formatINR } from '../data/demoData';

export default function ProductManagement() {
  const { shop } = useAuth();
  const shopId = shop?.id;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modal states: 'add' | 'edit' | null
  const [modalMode, setModalMode] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);

  // Delete confirmation modal state
  const [deleteCandidate, setDeleteCandidate] = useState(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState('groceries');
  const [formPrice, setFormPrice] = useState('');
  const [formOriginalPrice, setFormOriginalPrice] = useState('');
  const [formStock, setFormStock] = useState('10');
  const [formImages, setFormImages] = useState([]);
  const [formImageUrlInput, setFormImageUrlInput] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);
  
  const [formError, setFormError] = useState(null);
  const [formSaving, setFormSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Fetch shop's products
  const loadProducts = async () => {
    try {
      setLoading(true);
      if (shopId) {
        const data = await productsService.getProducts({
          shopId,
          includeInactive: true, // seller sees inactive as well
        });
        setProducts(data);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [shopId]);

  // Open Add modal
  const handleOpenAddModal = () => {
    setModalMode('add');
    setCurrentProduct(null);
    setFormTitle('');
    setFormDescription('');
    setFormCategory('groceries');
    setFormPrice('');
    setFormOriginalPrice('');
    setFormStock('10');
    setFormImages(['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80']);
    setFormImageUrlInput('');
    setFormIsActive(true);
    setFormError(null);
  };

  // Open Edit modal
  const handleOpenEditModal = (product) => {
    setModalMode('edit');
    setCurrentProduct(product);
    setFormTitle(product.title);
    setFormDescription(product.description);
    setFormCategory(product.category);
    setFormPrice(product.price.toString());
    setFormOriginalPrice(product.original_price ? product.original_price.toString() : '');
    setFormStock(product.stock.toString());
    setFormImages(product.images || []);
    setFormImageUrlInput('');
    setFormIsActive(product.is_active);
    setFormError(null);
  };

  // Handle Image File Upload
  const handleImageFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const url = await productsService.uploadProductImage(file);
      setFormImages(prev => [url, ...prev]);
    } catch (err) {
      console.error('Image upload failed:', err);
      setFormError('Failed to upload image. Please check file type and size.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Add Image by URL
  const handleAddImageUrl = () => {
    if (formImageUrlInput.trim()) {
      setFormImages(prev => [formImageUrlInput.trim(), ...prev]);
      setFormImageUrlInput('');
    }
  };

  // Remove Image from array
  const handleRemoveImage = (indexToRemove) => {
    setFormImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Save product (Add or Edit)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setFormError(null);

    // Strict validation
    if (!formTitle.trim() || formTitle.trim().length < 3) {
      setFormError('Product title must be at least 3 characters long.');
      return;
    }
    if (!formDescription.trim() || formDescription.trim().length < 10) {
      setFormError('Product description must be at least 10 characters long.');
      return;
    }
    const priceNum = Number(formPrice);
    if (isNaN(priceNum) || priceNum < 0) {
      setFormError('Price must be a valid non-negative number.');
      return;
    }
    const stockNum = Number(formStock);
    if (isNaN(stockNum) || stockNum < 0 || !Number.isInteger(stockNum)) {
      setFormError('Stock quantity must be a non-negative whole number.');
      return;
    }

    try {
      setFormSaving(true);
      const payload = {
        shop_id: shopId,
        title: formTitle,
        description: formDescription,
        category: formCategory,
        price: priceNum,
        original_price: formOriginalPrice ? Number(formOriginalPrice) : null,
        stock: stockNum,
        is_active: formIsActive,
        images: formImages.length > 0 ? formImages : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80'],
      };

      if (modalMode === 'add') {
        await productsService.createProduct(payload);
      } else if (modalMode === 'edit' && currentProduct) {
        await productsService.updateProduct(currentProduct.id, payload);
      }

      setModalMode(null);
      await loadProducts();
    } catch (err) {
      console.error('Failed to save product:', err);
      setFormError(err.message || 'An error occurred while saving the product.');
    } finally {
      setFormSaving(false);
    }
  };

  // Toggle active / inactive status
  const handleToggleActive = async (product) => {
    try {
      await productsService.updateProduct(product.id, { is_active: !product.is_active });
      setProducts(prev =>
        prev.map(p => (p.id === product.id ? { ...p, is_active: !p.is_active } : p))
      );
    } catch (err) {
      console.error('Failed to toggle active status:', err);
    }
  };

  // Confirm and Delete product
  const handleConfirmDelete = async () => {
    if (!deleteCandidate) return;
    try {
      await productsService.deleteProduct(deleteCandidate.id);
      setProducts(prev => prev.filter(p => p.id !== deleteCandidate.id));
      setDeleteCandidate(null);
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  // Filter products by search and category
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cream-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-display">
            Manage Products
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Publish, edit, update inventory, and manage listings for {shop?.name || 'your shop'}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/seller/ai-assistant"
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Generate with AI</span>
          </Link>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-white text-xs font-bold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-cream-200 shadow-xs">
        
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search products in your catalog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-xl border border-cream-300 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600 bg-cream-50/50"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-cream-300 text-xs font-semibold text-gray-700 bg-white focus:outline-none cursor-pointer"
          >
            {CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <span className="text-xs text-gray-400 font-medium px-2">
            {filteredProducts.length} items
          </span>
        </div>

      </div>

      {/* Products Table / Cards List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-20 rounded-2xl bg-cream-100 animate-shimmer"></div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="bg-white rounded-3xl border border-cream-200 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-cream-50 border-b border-cream-200 text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-cream-50/50 transition">
                    
                    {/* Title & Image */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200'}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <h4 className="font-bold text-gray-900 truncate">{p.title}</h4>
                          <p className="text-[11px] text-gray-400 truncate">{p.description}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 capitalize font-medium text-gray-600">
                      {p.category}
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4">
                      <span className="font-bold text-forest-900">{formatINR(p.price)}</span>
                      {p.original_price && (
                        <span className="text-[10px] text-gray-400 line-through block">
                          {formatINR(p.original_price)}
                        </span>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="py-3 px-4">
                      <span className={`font-semibold ${p.stock <= 0 ? 'text-rose-600' : p.stock <= 5 ? 'text-amber-600' : 'text-gray-700'}`}>
                        {p.stock <= 0 ? 'Out of stock' : `${p.stock} units`}
                      </span>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleActive(p)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition ${
                          p.is_active
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-gray-100 text-gray-500 border border-gray-300'
                        }`}
                        title="Click to toggle publish status"
                      >
                        {p.is_active ? <Eye className="w-3 h-3 text-emerald-600" /> : <EyeOff className="w-3 h-3 text-gray-400" />}
                        <span>{p.is_active ? 'Published' : 'Hidden'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/product/${p.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-cream-100"
                          title="Preview Listing"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-forest-800 hover:bg-cream-100"
                          title="Edit Product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteCandidate(p)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-cream-200 space-y-3">
          <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto" />
          <h3 className="text-base font-bold text-gray-900 font-display">
            No products in your catalog yet
          </h3>
          <p className="text-xs text-gray-500">
            Start adding your items or use the AI Assistant to generate rich listings.
          </p>
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 rounded-xl bg-forest-900 text-white text-xs font-semibold"
          >
            Add Your First Product
          </button>
        </div>
      )}

      {/* ==============================================================================
          ADD / EDIT PRODUCT MODAL
          ============================================================================== */}
      {modalMode && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div 
            className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-cream-200 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setModalMode(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-cream-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-gray-900 font-display mb-1">
              {modalMode === 'add' ? 'Add New Product Listing' : 'Edit Product Listing'}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              All details will be immediately visible on your public storefront.
            </p>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4">
              
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Product Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Lakadong Turmeric Powder (500g)"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600 bg-cream-50/50"
                />
              </div>

              {/* Category & Availability */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs font-medium text-gray-700 bg-cream-50/50 focus:outline-none focus:ring-2 focus:ring-forest-600"
                  >
                    {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Listing Status
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormIsActive(!formIsActive)}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition ${
                      formIsActive
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-gray-100 text-gray-600 border-gray-300'
                    }`}
                  >
                    {formIsActive ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5 text-gray-400" />}
                    <span>{formIsActive ? 'Active (Visible)' : 'Hidden (Draft)'}</span>
                  </button>
                </div>
              </div>

              {/* Price, Original Price, and Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Selling Price (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="any"
                    placeholder="280"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Original Price (₹) (Optional)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="350"
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Available Stock <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1"
                    placeholder="10"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600"
                  />
                </div>
              </div>

              {/* Images */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700">
                  Product Photos
                </label>
                
                {/* Image upload button & direct URL input */}
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer py-2 px-3 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-800 border border-forest-200 text-xs font-semibold flex items-center gap-1.5 transition">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>

                  <div className="flex-1 flex gap-1">
                    <input
                      type="url"
                      placeholder="Or paste photo URL..."
                      value={formImageUrlInput}
                      onChange={(e) => setFormImageUrlInput(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-cream-300 text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-3 py-1.5 rounded-xl bg-cream-200 hover:bg-cream-300 text-xs font-semibold text-gray-700"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Thumbnail list */}
                {formImages.length > 0 && (
                  <div className="flex items-center gap-2 overflow-x-auto pt-1">
                    {formImages.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-cream-300 shrink-0">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-0.5 right-0.5 p-0.5 bg-black/60 rounded-full text-white hover:bg-rose-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Product Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your product's craftsmanship, ingredients, sizing, and why customers should buy it..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600 bg-cream-50/50 resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="w-1/3 py-2.5 rounded-xl border border-cream-300 text-xs font-semibold text-gray-700 hover:bg-cream-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSaving}
                  className="w-2/3 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-white text-xs font-bold shadow-sm transition disabled:opacity-50"
                >
                  {formSaving ? 'Saving Listing...' : modalMode === 'add' ? 'Publish Product' : 'Save Changes'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ==============================================================================
          DELETE CONFIRMATION MODAL
          ============================================================================== */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-cream-200">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 font-display">Delete Listing?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Are you sure you want to permanently delete "{deleteCandidate.title}"? This cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="flex-1 py-2 rounded-xl border border-cream-300 text-xs font-semibold text-gray-700 hover:bg-cream-100"
              >
                Keep Product
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
