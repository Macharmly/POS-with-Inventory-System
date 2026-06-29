import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import AppLayout from '../components/AppLayout';

import {
  useAuthStore
} from '../store/authStore';

import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchDropdownOptions,
  createDropdownOption
} from '../services/productService';

interface Product {
  id: number;
  business_id: number;
  name: string;
  sku_barcode: string;
  category?: string;
  brand?: string;
  supplier?: string;
  unit_type?: string;
  description?: string;
  status?: 'active' | 'inactive';
  cost_price: number;
  selling_price: number;
  stock_quantity: number;
  low_stock_threshold: number;
}

export default function InventoryPage() {

  const navigate = useNavigate();

  const user = useAuthStore(
    (state) => state.user
  );

  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [newProduct, setNewProduct] =
    useState({
      name: '',
      sku_barcode: '',
      category: '',
      brand: '',
      supplier: '',
      unit_type: 'pcs',
      description: '',
      status: 'active',
      cost_price: '',
      selling_price: '',
      stock_quantity: '',
      low_stock_threshold: ''
    });
  
  const [showEditModal, setShowEditModal] =
    useState(false);

  const [editingProductId, setEditingProductId] =
    useState<number | null>(null);

  const [editProduct, setEditProduct] =
    useState({
      name: '',
      sku_barcode: '',
      category: '',
      brand: '',
      supplier: '',
      unit_type: 'pcs',
      description: '',
      status: 'active',
      cost_price: '',
      selling_price: '',
      stock_quantity: '',
      low_stock_threshold: ''
    });

  const [categories, setCategories] =
    useState<any[]>([]);

  const [brands, setBrands] =
    useState<any[]>([]);

  const [suppliers, setSuppliers] =
    useState<any[]>([]);

  const [units, setUnits] =
    useState<any[]>([]);

  const [searchTerm, setSearchTerm] =
    useState('');

  const [optionModal, setOptionModal] =
    useState<{
      open: boolean;
      type: string;
      label: string;
      field: keyof typeof newProduct;
    }>({
      open: false,
      type: '',
      label: '',
      field: 'category'
    });

  const [newOptionName, setNewOptionName] =
    useState('');

  useEffect(() => {

    const loadProducts = async () => {

      try {

        const data =
          await fetchProducts(
            Number(user?.business_id)
          );

        setProducts(data);

        const businessId =
          Number(user?.business_id);

        setCategories(
          await fetchDropdownOptions(
            'categories',
            businessId
          )
        );

        setBrands(
          await fetchDropdownOptions(
            'brands',
            businessId
          )
        );

        setSuppliers(
          await fetchDropdownOptions(
            'suppliers',
            businessId
          )
        );

        setUnits(
          await fetchDropdownOptions(
            'units',
            businessId
          )
        );

      } catch (error) {

        console.error(
          'Failed to load products',
          error
        );

      } finally {

        setLoading(false);

      }
    };

    if (user?.business_id) {

      loadProducts();

    }

  }, [user]);

  const filteredProducts =
    products.filter((product) =>
      product.name
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        ) ||

      product.sku_barcode
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        ) ||

      product.category
        ?.toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        ) ||

      product.id
        .toString()
        .includes(searchTerm)
    );

  const handleAddProduct = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      await createProduct({
        business_id: Number(
          user?.business_id
        ),
        name: newProduct.name,
        sku_barcode:
          newProduct.sku_barcode,
        category:
          newProduct.category,
        brand:
          newProduct.brand,
        supplier:
          newProduct.supplier,
        unit_type:
          newProduct.unit_type,
        description:
          newProduct.description,
        status:
          newProduct.status,
        cost_price: Number(
          newProduct.cost_price
        ),
        selling_price: Number(
          newProduct.selling_price
        ),
        stock_quantity: Number(
          newProduct.stock_quantity
        ),
        low_stock_threshold: Number(
          newProduct.low_stock_threshold
        )
      });

      const updatedProducts =
        await fetchProducts(
          Number(user?.business_id)
        );

      setProducts(updatedProducts);

      alert('Product added successfully!');

      setShowAddModal(false);

      setNewProduct({
        name: '',
        sku_barcode: '',
        category: '',
        brand: '',
        supplier: '',
        unit_type: 'pcs',
        description: '',
        status: 'active',
        cost_price: '',
        selling_price: '',
        stock_quantity: '',
        low_stock_threshold: ''
      });

    } catch (error) {

      console.error(
        'Failed to add product',
        error
      );

    }
  };

  const refreshDropdown = async (
    type: string
  ) => {
    const businessId =
      Number(user?.business_id);

    const data =
      await fetchDropdownOptions(
        type,
        businessId
      );

    if (type === 'categories') {
      setCategories(data);
    }

    if (type === 'brands') {
      setBrands(data);
    }

    if (type === 'suppliers') {
      setSuppliers(data);
    }

    if (type === 'units') {
      setUnits(data);
    }
  };

  const handleSaveNewOption = async () => {
    if (!newOptionName.trim()) {
      return;
    }

    await createDropdownOption(
      optionModal.type,
      Number(user?.business_id),
      newOptionName.trim()
    );

    await refreshDropdown(
      optionModal.type
    );

    setNewProduct({
      ...newProduct,
      [optionModal.field]:
        newOptionName.trim()
    });

    setNewOptionName('');

    setOptionModal({
      open: false,
      type: '',
      label: '',
      field: 'category'
    });
  };

  const renderDropdownWithAdd = (
    label: string,
    field: keyof typeof newProduct,
    options: any[],
    type: string
  ) => (
    <div>
      <label className="
        block
        text-sm
        font-medium
        mb-1
        text-zinc-700
        dark:text-zinc-300
      ">
        {label}
      </label>

      <div className="flex gap-2">
        <select
          value={newProduct[field]}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              [field]: e.target.value
            })
          }
          className="
            w-full
            border
            border-zinc-300
            dark:border-zinc-700
            rounded-md
            px-3
            py-2
            bg-white
            dark:bg-zinc-900
          "
        >
          <option value="">
            Select {label}
          </option>

          {options.map((option) => (
            <option
              key={option.id}
              value={option.name}
            >
              {option.name}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => {
            setNewOptionName('');

            setOptionModal({
              open: true,
              type,
              label,
              field
            });
          }}
          className="
            px-3
            rounded-md
            bg-blue-600
            text-white
            hover:bg-blue-700
          "
        >
          +
        </button>
      </div>
    </div>
  );

  const handleOpenEditModal = (
    product: Product
  ) => {
    setEditingProductId(product.id);

    setEditProduct({
      name: product.name,
      sku_barcode: product.sku_barcode,
      category: product.category || '',
      brand: product.brand || '',
      supplier: product.supplier || '',
      unit_type: product.unit_type || 'pcs',
      description: product.description || '',
      status: product.status || 'active',
      cost_price: String(product.cost_price),
      selling_price: String(product.selling_price),
      stock_quantity: String(product.stock_quantity),
      low_stock_threshold: String(
        product.low_stock_threshold || ''
      )
    });

    setShowEditModal(true);
  };

  const handleUpdateProduct = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!editingProductId) {
      return;
    }

    await updateProduct(
      editingProductId,
      {
        business_id: Number(user?.business_id),
        name: editProduct.name,
        sku_barcode: editProduct.sku_barcode,
        category: editProduct.category,
        brand: editProduct.brand,
        supplier: editProduct.supplier,
        unit_type: editProduct.unit_type,
        description: editProduct.description,
        status: editProduct.status,
        cost_price: Number(editProduct.cost_price),
        selling_price: Number(editProduct.selling_price),
        stock_quantity: Number(editProduct.stock_quantity),
        low_stock_threshold:
          editProduct.low_stock_threshold
            ? Number(editProduct.low_stock_threshold)
            : undefined
      }
    );

    const updatedProducts =
      await fetchProducts(
        Number(user?.business_id)
      );

    setProducts(updatedProducts);

    setShowEditModal(false);
    setEditingProductId(null);

    alert('Product updated successfully!');
  };

  const handleDeleteProduct = async (
    product: Product
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${product.name}"?`
      );

    if (!confirmed) {
      return;
    }

    await deleteProduct(
      product.id,
      Number(user?.business_id)
    );

    const updatedProducts =
      await fetchProducts(
        Number(user?.business_id)
      );

    setProducts(updatedProducts);

    alert('Product deleted successfully!');
  };

  const FieldLabel = ({
    children,
    required = false
  }: {
    children: React.ReactNode;
    required?: boolean;
  }) => (
    <label className="
      block
      text-sm
      font-medium
      mb-1
      text-zinc-700
      dark:text-zinc-300
    ">
      {children}
      {required && (
        <span className="text-red-500 ml-1">*</span>
      )}
    </label>
  );

  if (loading) {

    return (

      <AppLayout>

        <div className="
          flex
          items-center
          justify-center
          h-full
        ">

          <p className="
            text-zinc-500
            dark:text-zinc-400
          ">
            Loading inventory...
          </p>

        </div>

      </AppLayout>

    );
  }

  return (

    <AppLayout>

      <div className="space-y-6">

        {/* Add Product Modal */}

        {showAddModal && (

          <div className="
            fixed
            inset-0
            bg-black/50
            flex
            items-center
            justify-center
            z-50
            p-4
          ">

            <div className="
              bg-white
              dark:bg-zinc-900
              rounded-lg
              p-6
              w-full
              max-w-2xl
              max-h-[90vh]
              overflow-y-auto
              border
              border-zinc-200
              dark:border-zinc-800
            ">

              <h2 className="text-xl font-semibold mb-4">
                Add New Product
              </h2>

              <form
                onSubmit={handleAddProduct}
                className="space-y-4"
              >

                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                    Product Name <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    placeholder="Enter product name"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        name: e.target.value
                      })
                    }
                    className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-2 bg-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                    SKU / Barcode <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    placeholder="Enter SKU or barcode"
                    value={newProduct.sku_barcode}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        sku_barcode: e.target.value
                      })
                    }
                    className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-2 bg-transparent"
                    required
                  />
                </div>

                {renderDropdownWithAdd(
                  'Category',
                  'category',
                  categories,
                  'categories'
                )}

                {renderDropdownWithAdd(
                  'Brand',
                  'brand',
                  brands,
                  'brands'
                )}

                {renderDropdownWithAdd(
                  'Supplier',
                  'supplier',
                  suppliers,
                  'suppliers'
                )}

                {renderDropdownWithAdd(
                  'Unit Type',
                  'unit_type',
                  units,
                  'units'
                )}

                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                    Cost Price <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="number"
                    placeholder="Enter cost price"
                    value={newProduct.cost_price}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        cost_price: e.target.value
                      })
                    }
                    className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-2 bg-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                    Selling Price <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="number"
                    placeholder="Enter selling price"
                    value={newProduct.selling_price}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        selling_price: e.target.value
                      })
                    }
                    className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-2 bg-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                    Stock Quantity <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="number"
                    placeholder="Enter stock quantity"
                    value={newProduct.stock_quantity}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        stock_quantity: e.target.value
                      })
                    }
                    className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-2 bg-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                    Low Stock Threshold
                  </label>

                  <input
                    type="number"
                    placeholder="Example: 5"
                    value={newProduct.low_stock_threshold}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        low_stock_threshold: e.target.value
                      })
                    }
                    className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-2 bg-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                    Description
                  </label>

                  <textarea
                    placeholder="Enter product description"
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value
                      })
                    }
                    className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-2 bg-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                    Product Status
                  </label>

                  <select
                    value={newProduct.status}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        status: e.target.value
                      })
                    }
                    className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-2 bg-white dark:bg-zinc-900"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-2">

                  <button
                    type="button"
                    onClick={() =>
                      setShowAddModal(false)
                    }
                    className="px-4 py-2 rounded-md border border-zinc-300 dark:border-zinc-700"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Add Product
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

        {/* Edit Product Modal */}

        {showEditModal && (

          <div className="
            fixed
            inset-0
            bg-black/50
            flex
            items-center
            justify-center
            z-50
            p-4
          ">

            <div className="
              bg-white
              dark:bg-zinc-900
              rounded-lg
              p-6
              w-full
              max-w-2xl
              max-h-[90vh]
              overflow-y-auto
              border
              border-zinc-200
              dark:border-zinc-800
            ">

              <h2 className="text-xl font-semibold mb-4">
                Edit Product
              </h2>

              <form
                onSubmit={handleUpdateProduct}
                className="space-y-4"
              >

                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                    Product Name <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    placeholder="Enter product name"
                    value={editProduct.name}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        name: e.target.value
                      })
                    }
                    className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-2 bg-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                    SKU / Barcode <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    placeholder="Enter SKU or barcode"
                    value={editProduct.sku_barcode}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        sku_barcode: e.target.value
                      })
                    }
                    className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-2 bg-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                    Category
                  </label>

                  <select
                    value={editProduct.category}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        category: e.target.value
                      })
                    }
                    className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-2 bg-white dark:bg-zinc-900"
                  >
                    <option value="">Select Category</option>
                    {categories.map((item) => (
                      <option key={item.id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                    Brand
                  </label>

                  <select
                    value={editProduct.brand}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        brand: e.target.value
                      })
                    }
                    className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-2 bg-white dark:bg-zinc-900"
                  >
                    <option value="">Select Brand</option>
                    {brands.map((item) => (
                      <option key={item.id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                    Supplier
                  </label>

                  <select
                    value={editProduct.supplier}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        supplier: e.target.value
                      })
                    }
                    className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-2 bg-white dark:bg-zinc-900"
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map((item) => (
                      <option key={item.id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                    Unit Type
                  </label>

                  <select
                    value={editProduct.unit_type}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        unit_type: e.target.value
                      })
                    }
                    className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-2 bg-white dark:bg-zinc-900"
                  >
                    <option value="">Select Unit Type</option>
                    {units.map((item) => (
                      <option key={item.id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                    Cost Price <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="number"
                    placeholder="Enter cost price"
                    value={editProduct.cost_price}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        cost_price: e.target.value
                      })
                    }
                    className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-2 bg-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                    Selling Price <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="number"
                    placeholder="Enter selling price"
                    value={editProduct.selling_price}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        selling_price: e.target.value
                      })
                    }
                    className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-2 bg-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                    Stock Quantity <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="number"
                    placeholder="Enter stock quantity"
                    value={editProduct.stock_quantity}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        stock_quantity: e.target.value
                      })
                    }
                    className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-2 bg-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                    Low Stock Threshold
                  </label>

                  <input
                    type="number"
                    placeholder="Example: 5"
                    value={editProduct.low_stock_threshold}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        low_stock_threshold: e.target.value
                      })
                    }
                    className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-2 bg-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                    Description
                  </label>

                  <textarea
                    placeholder="Enter product description"
                    value={editProduct.description}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        description: e.target.value
                      })
                    }
                    className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-2 bg-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                    Product Status
                  </label>

                  <select
                    value={editProduct.status}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        status: e.target.value
                      })
                    }
                    className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-2 bg-white dark:bg-zinc-900"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-2">

                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingProductId(null);
                    }}
                    className="px-4 py-2 rounded-md border border-zinc-300 dark:border-zinc-700"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Save Changes
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

        {optionModal.open && (

        <div className="
          fixed
          inset-0
          bg-black/50
          flex
          items-center
          justify-center
          z-[60]
          p-4
        ">

          <div className="
            bg-white
            dark:bg-zinc-900
            rounded-lg
            p-6
            w-full
            max-w-sm
            border
            border-zinc-200
            dark:border-zinc-800
          ">

            <h2 className="
              text-lg
              font-semibold
              mb-4
            ">
              Add New {optionModal.label}
            </h2>

            <input
              type="text"
              placeholder={`Enter ${optionModal.label}`}
              value={newOptionName}
              onChange={(e) =>
                setNewOptionName(e.target.value)
              }
              className="
                w-full
                border
                border-zinc-300
                dark:border-zinc-700
                rounded-md
                px-3
                py-2
                bg-transparent
              "
            />

            <div className="
              flex
              justify-end
              gap-3
              mt-5
            ">

              <button
                type="button"
                onClick={() => {
                  setOptionModal({
                    open: false,
                    type: '',
                    label: '',
                    field: 'category'
                  });

                  setNewOptionName('');
                }}
                className="
                  px-4
                  py-2
                  rounded-md
                  border
                  border-zinc-300
                  dark:border-zinc-700
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveNewOption}
                className="
                  bg-blue-600
                  text-white
                  px-4
                  py-2
                  rounded-md
                  hover:bg-blue-700
                "
              >
                Save
              </button>

            </div>

          </div>

        </div>

      )}

        {/* Page Header */}

        <div className="
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-4
        ">

          <div>

            <h1 className="
              text-3xl
              font-semibold
              tracking-tight
            ">
              Inventory
            </h1>

            <p className="
              text-sm
              text-zinc-500
              dark:text-zinc-400
              mt-1
            ">
              Monitor and manage inventory stock levels.
            </p>

          </div>

          <div className="
            flex
            flex-col
            sm:flex-row
            gap-3
          ">

            <button
              onClick={() =>
                setShowAddModal(true)
              }
              className="
                bg-blue-600
                text-white
                px-4
                py-2.5
                rounded-md
                text-sm
                font-medium
                transition
                hover:bg-blue-700
              "
            >
              Add Item
            </button>

            <button
              onClick={() =>
                navigate('/restock')
              }
              className="
                bg-zinc-900
                dark:bg-zinc-100
                text-white
                dark:text-zinc-900
                px-4
                py-2.5
                rounded-md
                text-sm
                font-medium
                transition
                hover:opacity-90
              "
            >
              Restock Inventory
            </button>

          </div>

        </div>

        {/* Inventory Table */}

        <div className="
          bg-white
          dark:bg-zinc-900
          border
          border-zinc-200
          dark:border-zinc-800
          rounded-lg
          shadow-sm
          overflow-hidden
        ">

          <div className="
            px-6
            py-5
            border-b
            border-zinc-200
            dark:border-zinc-800
            flex
            flex-col
            md:flex-row
            md:items-center
            md:justify-between
            gap-4
          ">

            <div>

              <h2 className="
                text-lg
                font-semibold
              ">
                Product Inventory
              </h2>

              <p className="
                text-sm
                text-zinc-500
                dark:text-zinc-400
                mt-1
              ">
                View current product pricing and stock availability.
              </p>

            </div>

            <input
              type="text"
              placeholder="Search products, SKU, category, ID..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
              className="
                w-full
                md:w-80
                border
                border-zinc-300
                dark:border-zinc-700
                rounded-md
                px-4
                py-2
                bg-transparent
                text-sm
              "
            />

          </div>

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="
                border-b
                border-zinc-200
                dark:border-zinc-800
              ">

                <tr>

                  <th className="
                    px-6
                    py-4
                    text-left
                    text-sm
                    font-medium
                    text-zinc-500
                    dark:text-zinc-400
                  ">
                    Item ID
                  </th>

                  <th className="
                    px-6
                    py-4
                    text-left
                    text-sm
                    font-medium
                    text-zinc-500
                    dark:text-zinc-400
                  ">
                    Product Name
                  </th>

                  <th className="
                    px-6
                    py-4
                    text-left
                    text-sm
                    font-medium
                    text-zinc-500
                    dark:text-zinc-400
                  ">
                    SKU / Barcode
                  </th>

                  <th className="
                    px-6
                    py-4
                    text-left
                    text-sm
                    font-medium
                    text-zinc-500
                    dark:text-zinc-400
                  ">
                    Category
                  </th>

                  <th className="
                    px-6
                    py-4
                    text-left
                    text-sm
                    font-medium
                    text-zinc-500
                    dark:text-zinc-400
                  ">
                    Cost Price
                  </th>

                  <th className="
                    px-6
                    py-4
                    text-left
                    text-sm
                    font-medium
                    text-zinc-500
                    dark:text-zinc-400
                  ">
                    Selling Price
                  </th>

                  <th className="
                    px-6
                    py-4
                    text-left
                    text-sm
                    font-medium
                    text-zinc-500
                    dark:text-zinc-400
                  ">
                    Stock Quantity
                  </th>

                  <th className="
                    px-6
                    py-4
                    text-left
                    text-sm
                    font-medium
                    text-zinc-500
                    dark:text-zinc-400
                  ">
                    Stock Status
                  </th>

                  <th className="
                    px-6
                    py-4
                    text-left
                    text-sm
                    font-medium
                    text-zinc-500
                    dark:text-zinc-400
                  ">
                    Product Status
                  </th>

                  <th className="
                    px-6
                    py-4
                    text-left
                    text-sm
                    font-medium
                    text-zinc-500
                    dark:text-zinc-400
                  ">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredProducts.length === 0 ? (

                  <tr>

                    <td
                      colSpan={10}
                      className="
                        px-6
                        py-12
                        text-center
                        text-zinc-500
                        dark:text-zinc-400
                      "
                    >
                      No inventory products found.
                    </td>

                  </tr>

                ) : (

                  filteredProducts.map(
                    (product) => (

                    <tr
                      key={product.id}
                      className="
                        border-b
                        border-zinc-100
                        dark:border-zinc-800
                        hover:bg-zinc-50
                        dark:hover:bg-zinc-800/50
                        transition
                      "
                    >

                      <td className="
                        px-6
                        py-4
                        font-medium
                      ">
                        #{product.id}
                      </td>

                      <td className="
                        px-6
                        py-4
                        font-medium
                      ">
                        {product.name}
                      </td>

                      <td className="
                        px-6
                        py-4
                      ">
                        {product.sku_barcode}
                      </td>

                      <td className="
                        px-6
                        py-4
                      ">
                        {product.category || 'N/A'}
                      </td>

                      <td className="
                        px-6
                        py-4
                      ">
                        ₱
                        {Number(
                          product.cost_price
                        ).toFixed(2)}
                      </td>

                      <td className="
                        px-6
                        py-4
                      ">
                        ₱
                        {Number(
                          product.selling_price
                        ).toFixed(2)}
                      </td>

                      <td className="
                        px-6
                        py-4
                      ">

                        <span
                          className={
                            product.stock_quantity <=
                            product.low_stock_threshold
                              ? 'text-red-600 font-semibold'
                              : ''
                          }
                        >
                          {product.stock_quantity}
                        </span>

                      </td>

                      <td className="
                        px-6
                        py-4
                      ">

                        {product.stock_quantity <=
                          product.low_stock_threshold ? (

                          <span className="
                            inline-flex
                            items-center
                            bg-red-100
                            dark:bg-red-500/10
                            text-red-700
                            dark:text-red-400
                            border
                            border-red-200
                            dark:border-red-500/20
                            px-3
                            py-1
                            rounded-md
                            text-xs
                            font-medium
                          ">
                            Low Stock
                          </span>

                        ) : (

                          <span className="
                            inline-flex
                            items-center
                            bg-emerald-100
                            dark:bg-emerald-500/10
                            text-emerald-700
                            dark:text-emerald-400
                            border
                            border-emerald-200
                            dark:border-emerald-500/20
                            px-3
                            py-1
                            rounded-md
                            text-xs
                            font-medium
                          ">
                            In Stock
                          </span>

                        )}

                      </td>

                      <td className="
                        px-6
                        py-4
                      ">
                        {product.status === 'inactive' ? (

                          <span className="
                            inline-flex
                            items-center
                            bg-zinc-100
                            dark:bg-zinc-800
                            text-zinc-600
                            dark:text-zinc-400
                            border
                            border-zinc-200
                            dark:border-zinc-700
                            px-3
                            py-1
                            rounded-md
                            text-xs
                            font-medium
                          ">
                            Inactive
                          </span>

                        ) : (

                          <span className="
                            inline-flex
                            items-center
                            bg-blue-100
                            dark:bg-blue-500/10
                            text-blue-700
                            dark:text-blue-400
                            border
                            border-blue-200
                            dark:border-blue-500/20
                            px-3
                            py-1
                            rounded-md
                            text-xs
                            font-medium
                          ">
                            Active
                          </span>

                        )}
                      </td>

                      <td className="
                        px-6
                        py-4
                      ">
                        <div className="
                          flex
                          gap-2
                        ">

                          <button
                            type="button"
                            onClick={() =>
                              handleOpenEditModal(product)
                            }
                            className="
                              px-3
                              py-1.5
                              rounded-md
                              text-xs
                              font-medium
                              bg-blue-100
                              text-blue-700
                              hover:bg-blue-200
                              dark:bg-blue-500/10
                              dark:text-blue-400
                              dark:hover:bg-blue-500/20
                            "
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteProduct(product)
                            }
                            className="
                              px-3
                              py-1.5
                              rounded-md
                              text-xs
                              font-medium
                              bg-red-100
                              text-red-700
                              hover:bg-red-200
                              dark:bg-red-500/10
                              dark:text-red-400
                              dark:hover:bg-red-500/20
                            "
                          >
                            Delete
                          </button>

                        </div>
                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </AppLayout>

  );
}