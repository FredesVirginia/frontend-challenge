import { useState } from "react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/utils";
import "./Cart.css";

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();
  
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "",
    address: "",
    card: "",
    email: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.basePrice * item.quantity,
    0
  );
  const total = cart.reduce((sum, item) => {
    if (item.product.priceBreaks && item.product.priceBreaks.length > 0) {
      // Busca el mejor priceBreak
      let applicableBreak = item.product.priceBreaks[0];
      for (const pb of item.product.priceBreaks) {
        if (item.quantity >= pb.minQty) applicableBreak = pb;
      }
      return sum + applicableBreak.price * item.quantity;
    } else {
      return sum + item.product.basePrice * item.quantity;
    }
  }, 0);

  

  return (
    <div className="cart-page">
      
    {cart.length > 0 ? (
        <div>
            <h2>Carrito de compras</h2>
      <button className="btn btn-secondary" onClick={clearCart}>
        Vaciar carrito
      </button>
      <table className="cart-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item.product.id}>
              <td>{item.product.name}</td>
              <td>{item.quantity}</td>
              <td>{formatPrice(item.product.basePrice * item.quantity)}</td>
              <td>
                <button onClick={() => removeFromCart(item.product.id)}>
                  <span className="material-icons">delete</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="cart-summary">
        <div>Subtotal: {formatPrice(subtotal)}</div>
        <div>Total con descuentos: {formatPrice(total)}</div>
      </div>
     
      <button
        className="btn btn-primary"
        style={{
          marginTop: "1.5rem",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={() => setShowCheckout(true)}
      >
        Comprar carrito
      </button>
        </div>
    ) : null}
      {showCheckout && (
        <div className="modal-overlay active">
          <div className="modal-content">
            <span
              className="material-icons modal-close"
              onClick={() => setShowCheckout(false)}
            >
              close
            </span>
            <h2>Datos de envío y pago</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowCheckout(false);
                setShowSuccess(true);
                clearCart();
              }}
              className="checkout-form"
            >
              <h4 className="form-section-title">Datos personales</h4>
              <div className="form-grid">
                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={form.name}
                  required
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={form.email}
                  required
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Dirección de envío"
                  value={form.address}
                  required
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
              </div>
              <h4 className="form-section-title">Datos de tarjeta</h4>
              <div className="form-grid">
                <input
                  type="text"
                  placeholder="Número de tarjeta"
                  value={form.card}
                  required
                  maxLength={16}
                  pattern="\d{16}"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      card: e.target.value.replace(/\D/g, ""),
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Nombre del titular"
                  value={form.cardName || ""}
                  required
                  onChange={(e) =>
                    setForm({ ...form, cardName: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Fecha de expiración (MM/AA)"
                  value={form.expiry || ""}
                  required
                  pattern="\d{2}/\d{2}"
                  maxLength={5}
                  onChange={(e) => setForm({ ...form, expiry: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Código de seguridad (CVV)"
                  value={form.cvv || ""}
                  required
                  maxLength={4}
                  pattern="\d{3,4}"
                  onChange={(e) =>
                    setForm({ ...form, cvv: e.target.value.replace(/\D/g, "") })
                  }
                />
              </div>
              <button
                className="btn btn-primary"
                type="submit"
                style={{ marginTop: "1rem" }}
               
              >
                Comprar
              </button>
            </form>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="modal-overlay active">
          <div className="modal-content">
            
            <h2>¡Gracias por tu compra!</h2>
            <p>Tu pedido ha sido recibido y será procesado pronto.</p>
            <button
            style={{marginTop: "20px"}}
              className="btn btn-primary"
              onClick={() => {setShowSuccess(false) , setShowCheckout(false)}}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {cart.length === 0 && !showCheckout && !showSuccess && (
        <div className="cart-empty">Tu carrito está vacío.</div>
      )}
    </div>
  );
}
