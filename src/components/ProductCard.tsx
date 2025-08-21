import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useState } from "react";
import { Link } from "react-router-dom";
import { empresa } from "../data/company";
import { Product } from "../types/Product";
import { formatPrice } from "../utils/utils";
import PortalModal from "./PortalModal";
import { PricingQuote } from "./PricingQuote";
import "./ProductCard.css";
interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [open, setOpen] = useState(false);
  const [quoteValues, setQuoteValues] = useState({
    subtotal: 0,
    total: 0,
    quantity: 1,
  });
  // Handle product status display
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="status-badge status-active l1">Disponible</span>
        );
      case "inactive":
        return (
          <span className="status-badge status-inactive l1">No disponible</span>
        );
      case "pending":
        // Handle pending status
        return (
          <span className="status-badge status-active l1">Disponible</span>
        );
      default:
        return null;
    }
  };

  // Check stock availability
  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return <span className="stock-status out-of-stock l1">Sin stock</span>;
    } else if (stock < 10) {
      return (
        <span className="stock-status low-stock l1">Stock bajo ({stock})</span>
      );
    }
    return (
      <span className="stock-status in-stock l1">{stock} disponibles</span>
    );
  };

  // Calculate discount percentage
  const getDiscountPrice = () => {
    if (product.priceBreaks && product.priceBreaks.length > 1) {
      const bestDiscount = product.priceBreaks[product.priceBreaks.length - 1];
      return bestDiscount.price;
    }
    return null;
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    // --- Título ---
    doc.setFontSize(16);
    doc.text(`Cotización: ${product.name}`, 10, 20);

    // --- Información del producto ---
    doc.setFontSize(12);
    doc.text(`SKU: ${product.sku}`, 10, 30);
    doc.text(`Categoría: ${product.category}`, 10, 37);
    doc.text(`Proveedor: ${product.supplier}`, 10, 44);
    doc.text(
      `Precio base: ${product.basePrice?.toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
      })}`,
      10,
      51
    );
    doc.text(`Stock: ${product.stock} unidades`, 10, 58);

    // --- Información de la empresa ---
    doc.setFontSize(14);
    doc.text("Empresa", 10, 68);
    doc.setFontSize(12);
    doc.text(`Nombre: ${empresa.nombre}`, 10, 75);
    doc.text(`Dirección: ${empresa.direccion}`, 10, 82);
    doc.text(`Teléfono: ${empresa.telefono}`, 10, 89);
    doc.text(`Email: ${empresa.email}`, 10, 96);
    doc.text(`CUIT: ${empresa.cuit}`, 10, 103);

    // --- Tabla de Escalas de precio ---
    let yAfterTable = 115; // valor por defecto si no hay tabla
    if (product.priceBreaks && product.priceBreaks.length > 0) {
      const tableData = product.priceBreaks.map((pb) => [
        pb.minQty,
        `$${pb.price.toLocaleString("es-AR")}`,
        pb.discount ? `${pb.discount}% OFF` : "-",
      ]);

      autoTable(doc, {
        startY: 115,
        head: [["Cantidad mínima", "Precio", "Descuento"]],
        body: tableData,
        styles: { fontSize: 12 },
        headStyles: { fillColor: [22, 160, 133], textColor: 255 },
      });

      yAfterTable = (doc as any).lastAutoTable.finalY + 10;
    }

    // --- Cotización dinámica ---
    doc.setFontSize(14);
    doc.text("Cotización dinámica", 10, yAfterTable);
    doc.setFontSize(12);
    doc.text(`Cantidad: ${quoteValues.quantity}`, 10, yAfterTable + 7);
    doc.text(
      `Subtotal: $${quoteValues.subtotal.toLocaleString("es-AR")}`,
      10,
      yAfterTable + 14
    );
    doc.text(
      `Total: $${quoteValues.total.toLocaleString("es-AR")}`,
      10,
      yAfterTable + 21
    );

    // --- Guardar PDF ---
    doc.save(`Cotizacion_${product.name}.pdf`);
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-link">
        {/* Product Image */}
        <div className="product-image">
          {/* Bug: no real image handling */}
          <div className="image-placeholder">
            <span className="material-icons">image</span>
          </div>

          {/* Status Badge */}
          <div className="product-status">{getStatusBadge(product.status)}</div>
        </div>

        {/* Product Info */}
        <div className="product-info">
          <div className="product-header">
            <h3 className="product-name p1-medium">{product.name}</h3>
            <p className="product-sku l1">{product.sku}</p>
          </div>

          <div className="product-details">
            <div className="product-category">
              <span className="material-icons">category</span>
              <span className="l1">{product.category}</span>
            </div>

            {getStockStatus(product.stock)}
          </div>

          {/* Features - Bug: displays all features without limit */}
          {product.features && (
            <div className="product-features">
              {product.features.map((feature, index) => (
                <span key={index} className="feature-tag l1">
                  {feature}
                </span>
              ))}
            </div>
          )}

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="product-colors">
              <span className="colors-label l1">
                {product.colors.length} colores:
              </span>
              <div className="colors-preview">
                {product.colors.slice(0, 3).map((color, index) => (
                  <div key={index} className="color-dot" title={color}></div>
                ))}
                {product.colors.length > 3 && (
                  <span className="more-colors l1">
                    +{product.colors.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Product Footer */}
      <div className="product-footer">
        <div className="price-section">
          <div className="current-price p1-medium">
            {formatPrice(product.basePrice)}
          </div>
          {getDiscountPrice() && (
            <div className="discount-info">
              <span className="discount-price l1">
                {formatPrice(getDiscountPrice()!)}
              </span>
              <span className="discount-label l1">desde 50 unidades</span>
            </div>
          )}
        </div>

        <div className="card-actions">
          <button
            className="btn btn-secondary l1"
            onClick={(e) => {
              e.preventDefault();

              setOpen(true);
            }}
          >
            <span className="material-icons">calculate</span>
            Cotizar
          </button>
        </div>
      </div>

      {/* Modal (renderizado al final del card) */}

      <PortalModal open={open} onClose={() => setOpen(false)}>
        <h2 className="modal-title">Cotización de {product.name}</h2>

        <section className="modal-section">
          <h3>Empresa</h3>
          <p>
            <strong>{empresa.nombre}</strong>
          </p>
          <p>{empresa.direccion}</p>
          <p>{empresa.telefono}</p>
          <p>{empresa.email}</p>
          <p>CUIT: {empresa.cuit}</p>
        </section>

        <section className="modal-section">
          <h3>Producto</h3>
          <p>
            <strong>SKU:</strong> {product.sku}
          </p>
          <p>
            <strong>Categoría:</strong> {product.category}
          </p>
          <p>
            <strong>Proveedor:</strong> {product.supplier}
          </p>
          <p>
            <strong>Precio base:</strong>{" "}
            {product.basePrice?.toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}
          </p>
          <p>
            <strong>Stock:</strong> {product.stock} unidades
          </p>
          {product.priceBreaks!.length > 0 && (
            <>
              <h4>Escalas de precio</h4>
              <ul className="price-breaks">
                {product.priceBreaks!.map((pb, i) => (
                  <li key={i}>
                    <span>
                      {pb.minQty}+ unidades →{" "}
                      {pb.price.toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                      })}
                    </span>
                    {pb.discount ? <em>{pb.discount}% OFF</em> : null}
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
        <PricingQuote
          product={product}
          quantityQuote={quoteValues.quantity}
          onPricingChange={(newValues) => setQuoteValues(newValues)}
        />

        <div className="modal-actions">
          <button className="btn btn-export" onClick={handleExportPDF}>
            Exportar PDF
          </button>
          <button className="btn btn-close" onMouseDown={() => setOpen(false)}>
            Cerrar
          </button>
        </div>
      </PortalModal>
    </div>
  );
};

export default ProductCard;
