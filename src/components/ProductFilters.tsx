import { categories, suppliers } from "../data/products";
import { CategoryType, SupplierType } from "../types/Product";
import "./ProductFilters.css";

interface ProductFiltersProps {
  selectedCategory: string;
  selectedSupplier: SupplierType;
  searchQuery: string;
  sortBy: string;
  onCategoryChange: (category: string) => void;
  onSuppliersChange: (suppliers: SupplierType) => void;
  onSearchChange: (search: string) => void;
  onSortChange: (sort: string) => void;
}

const ProductFilters = ({
  selectedCategory,
  selectedSupplier,
  searchQuery,
  sortBy,
  onCategoryChange,
  onSearchChange,
  onSuppliersChange,
  onSortChange,
}: ProductFiltersProps) => {
  console.log("PROVEED ODRES", selectedSupplier);
  return (
    <div className="product-filters">
      <div className="filters-card">
        {/* Search Bar */}
        <div className="search-section">
          <div className="search-box">
            <span className="material-icons">search</span>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
              }}
              className="search-input p1"
            />
            {searchQuery && (
              <button
                className="clear-search"
                onClick={() => onSearchChange("")}
              >
                <span className="material-icons">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="filter-section">
          <h3 className="filter-title p1-medium">Categorías</h3>
          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-btn ${
                  selectedCategory === category.id ? "active" : ""
                }`}
                onClick={() => onCategoryChange(category.id)}
              >
                <span className="material-icons">{category.icon}</span>
                <span className="category-name l1">{category.name}</span>
                <span className="category-count l1">({category.count})</span>
              </button>
            ))}
            <button
              onClick={() => onCategoryChange(CategoryType.All)}
              className={`clear-btn `}
            >
              Limpiar Filtro
            </button>
          </div>
        </div>

        {/* Sort Options */}
        <div className="filter-section">
          <h3 className="filter-title p1-medium">Ordenar por</h3>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="sort-select p1"
          >
            <option value="name">Nombre A-Z</option>
            <option value="price-asc">Precio menor a mayor</option>
            <option value="price-desc">Precio mayor a menor</option>
            <option value="stock">Stock disponible</option>
          </select>
        </div>

        {/* Quick Stats - Bug: hardcoded values instead of dynamic */}
        <div className="filter-section">
          <h3 className="filter-title p1-medium">Proveedores</h3>
          <div  className="supplier-list">
            {suppliers.map((supplier) => (
              <div
                key={supplier.id}
                className={`supplier-item ${
                  selectedSupplier === supplier.id ? "active" : ""
                }`}
              >
                <span
                  onClick={() => {
                    onSuppliersChange(supplier.id as SupplierType);
                  }}
                  className="supplier-name l1"
                >
                  {supplier.name}
                </span>
                <span className="supplier-count l1">{supplier.products}</span>
              </div>
            ))}
            <span
                style={{cursor:"pointer"}}
            onClick={() => {
              onSuppliersChange(SupplierType.Default)}} className="supplier-name l1">
            Limpiar Filtro
          </span>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
