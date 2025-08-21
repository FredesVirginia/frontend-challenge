import { useState } from "react";
import ProductCard from "../components/ProductCard";
import ProductFilters from "../components/ProductFilters";
import { products as allProducts } from "../data/products";
import { Product, SupplierType } from "../types/Product";
import "./ProductList.css";

const ProductList = () => {
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(allProducts);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSuppliers, setSelectedSuppliers] = useState<SupplierType>(
    SupplierType.Default
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // Filter and sort products based on criteria
  const filterProducts = (
    category: string,
    search: string,
    sort: string,
    supplier: string
  ) => {
    let filtered = [
      ...allProducts.filter(
        (p) => p.status !== "pending" && p.status !== "inactive"
      ),
    ];
    // Category filter
    if (category !== "all") {
      filtered = filtered.filter((product) => product.category === category);
    }

    // Search filter
    if (search) {
      // Normalizamos la entrada de busqueda para manejar acentos y distinguir entre mayusculas y minusculas
      const normalizedSearch = search
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      filtered = filtered.filter((product) => {
        const nameNormalized = product.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        const skuNormalized = product.sku
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        return (
          nameNormalized.includes(normalizedSearch) ||
          skuNormalized.includes(normalizedSearch)
        );
      });
    }

    if (supplier && supplier !== SupplierType.Default) {
      if (supplier) {
        filtered = filtered.filter(
          (product) => product.supplier && product.supplier === supplier
        );
      }
    }

    // Sorting logic
    switch (sort) {
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price-asc":
        filtered.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case "stock":
        filtered.sort((a, b) => b.stock - a.stock);
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    filterProducts(category, searchQuery, sortBy, selectedSuppliers);
  };

  const handleSuSupplierChange = (supplier: SupplierType) => {
    setSelectedSuppliers(supplier);
    filterProducts(selectedCategory, searchQuery, sortBy, supplier);
  };

  const handleSearchChange = (search: string) => {
    setSearchQuery(search);
    filterProducts(selectedCategory, search, sortBy, selectedSuppliers);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    filterProducts(selectedCategory, searchQuery, sort, selectedSuppliers);
  };

  return (
    <div className="product-list-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-info">
            <h1 className="page-title h2">Catálogo de Productos</h1>
            <p className="page-subtitle p1">
              Descubre nuestra selección de productos promocionales premium
            </p>
          </div>

          <div className="page-stats">
            <div className="stat-item">
              <span className="stat-value p1-medium">
                {filteredProducts.length}
              </span>
              <span className="stat-label l1">productos</span>
            </div>
            <div className="stat-item">
              <span className="stat-value p1-medium">6</span>
              <span className="stat-label l1">categorías</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <ProductFilters
          selectedCategory={selectedCategory}
          selectedSupplier={selectedSuppliers}
          searchQuery={searchQuery}
          sortBy={sortBy}
          onCategoryChange={handleCategoryChange}
          onSuppliersChange={handleSuSupplierChange}
          onSearchChange={handleSearchChange}
          onSortChange={handleSortChange}
        />

        {/* Products Grid */}
        <div className="products-section">
          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <span className="material-icons">search_off</span>
              <h3 className="h2">No hay productos</h3>
              <p className="p1">
                No se encontraron productos que coincidan con tu búsqueda.
              </p>
              <button
                className="btn btn-primary cta1"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  filterProducts("all", "", sortBy, SupplierType.Default);
                }}
              >
                Ver todos los productos
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
