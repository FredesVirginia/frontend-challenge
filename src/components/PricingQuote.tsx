import { useState } from "react";
import { Product } from "../types/Product";
import "./PricingCalculator.css";

import { formatPrice } from "../utils/utils";
interface PricingCalculatorProps {
  product: Product;
  quantityQuote: number;
  onPricingChange: (data: {
    quantity: number;
    subtotal: number;
    total: number;
  }) => void;
}
export const PricingQuote = ({ product   , onPricingChange}: PricingCalculatorProps) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedBreak, setSelectedBreak] = useState<number>(0);

  // Calculate best pricing for quantity
  const calculatePrice = (qty: number) => {
    if (!product.priceBreaks || product.priceBreaks.length === 0) {
      return product.basePrice * qty;
    }
    // Ordenamos los priceBreaks por minQty ascendente
    const sortedBreaks = [...product.priceBreaks].sort(
      (a, b) => a.minQty - b.minQty
    );
    let applicableBreak = sortedBreaks[0];
    for (let i = 0; i < sortedBreaks.length; i++) {
      if (qty >= sortedBreaks[i].minQty) {
        applicableBreak = sortedBreaks[i];
      }
    }
    return applicableBreak.price * qty;
  };

  // Calculate discount amount
  const getDiscount = (qty: number) => {
    if (!product.priceBreaks || product.priceBreaks.length === 0) {
      return 0;
    }
    // Encuentra el priceBreak aplicable
    let applicableBreak = product.priceBreaks[0];
    for (let i = 0; i < product.priceBreaks.length; i++) {
      if (qty >= product.priceBreaks[i].minQty) {
        applicableBreak = product.priceBreaks[i];
      }
    }
    // Devuelve el campo discount si existe, si no, calcula el porcentaje real
    return (
      applicableBreak.discount ??
      ((product.basePrice - applicableBreak.price) / product.basePrice) * 100
    );
  };
  const currentPrice = calculatePrice(quantity);
  const discountPercent = getDiscount(quantity);
  const subtotal = product.basePrice * quantity;
  return (
    <div className="pricing-calculator">
      <div className="calculator-header">
        <h3 className="calculator-title p1-medium">Cotizacion</h3>
      </div>

      <div className="calculator-content">
        {/* Price Breaks */}
        {product.priceBreaks && product.priceBreaks.length > 0 && (
          <div className="price-breaks-section">
            <h4 className="breaks-title p1-medium">Descuentos por volumen</h4>
            <div className="price-breaks">
              {product.priceBreaks.map((priceBreak, index) => {
                const isActive = quantity >= priceBreak.minQty;
                const isSelected = selectedBreak === index;

                return (
                  <div
                    key={index}
                    className={`price-break ${isActive ? "active" : ""} ${
                      isSelected ? "selected" : ""
                    }`}
                    onClick={() => {
                      setSelectedBreak(index);
                      setQuantity(priceBreak.minQty);
                    }}
                  >
                    <div className="break-quantity l1">
                      {priceBreak.minQty}+ unidades
                    </div>
                    <div className="break-price p1-medium">
                      {formatPrice(priceBreak.price)} por unidad
                    </div>
                    {priceBreak.discount && (
                      <div className="break-discount l1">
                        -{priceBreak.discount}%
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {/* Quantity Input */}
        <div className="quantity-section">
          <label className="quantity-label p1-medium">Cantidad</label>
          <div className="quantity-input-group">
            <input
              type="number"
              value={quantity}
              onChange={(e) => {
                const qty = Math.max(1, parseInt(e.target.value) || 1);
                setQuantity(qty);

                const subtotal = qty * product.basePrice;
                const total = subtotal; 

                
                  onPricingChange({ quantity: qty, subtotal, total });
                
              }}
              className="quantity-input p1"
              min="1"
              max={product.stock}
            />
            <span className="quantity-unit l1">unidades</span>
          </div>
        </div>
        {/* Price Summary */}
        <div className="price-summary">
          <div className="summary-row">
            <span className="summary-label p1">Precio unitario:</span>
            <span className="summary-value p1-medium">
              {formatPrice(calculatePrice(quantity) / quantity)}
            </span>
          </div>

          <div className="summary-row">
            <span className="summary-label p1">Cantidad:</span>
            <span className="summary-value p1-medium">{quantity} unidades</span>
          </div>

          {discountPercent > 0 && (
            <div className="summary-row discount-row">
              <span className="summary-label p1">Descuento:</span>
              <span className="summary-value discount-value p1-medium">
                -{discountPercent.toFixed(1)}%
              </span>
            </div>
          )}

          <div className="summary-row total-row">
            <span className="summary-label p1-medium">Subtotal:</span>
            <span className="">{formatPrice(subtotal)}</span>
          </div>
          <div className="summary-row total-row">
            <span className="summary-label p1-medium">Total:</span>
            <span className="summary-value total-value h2">
              {formatPrice(currentPrice)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
