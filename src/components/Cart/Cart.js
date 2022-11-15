import { useState, useContext } from "react";
import CartItem from "./CartItem";
import Modal from "../UI/Modal";
import Checkout from "./Checkout";
import CartContext from "../../store/cart-context";
import classes from "./Cart.module.css";

const Cart = (props) => {
  const cartCtx = useContext(CartContext);
  const [isOrdered, setIsOrdered] = useState(false);
  const [didSubmit, setDidSumit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;

  const cartItemAddHandler = (item) => {
    cartCtx.addItem({ ...item, amount: 1 });
  };
  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const orderHandler = () => {
    setIsOrdered(true);
    console.log(cartItems);
  };

  const submitOrderHandler = async (userData) => {
    try {
      setIsSubmitting(true);
      const response = await fetch(
        "https://react-http-98ef4-default-rtdb.firebaseio.com/orders.json",
        {
          method: "POST",
          body: JSON.stringify({
            user: userData,
            orderedItems: cartCtx.items,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        console.log(response);
        throw new Error("Something went wrong!");
      }
      const data = await response.json();
      setDidSumit(true);
      cartCtx.clearCart()
      console.log(data);
    } catch (error) {
      alert(error.message);
    }
    setIsSubmitting(false);
  };

  const cartItems = cartCtx.items.map((item) => (
    <CartItem
      key={item.id}
      name={item.name}
      amount={item.amount}
      price={item.price}
      onAdd={cartItemAddHandler.bind(null, item)}
      onRemove={cartItemRemoveHandler.bind(null, item.id)}
    />
  ));

  const modalActions = (
    <div className={classes.actions}>
      <button onClick={props.onClose} className={classes["button--alt"]}>
        Close
      </button>
      {hasItems && (
        <button onClick={orderHandler} className={classes.button}>
          Order
        </button>
      )}
    </div>
  );

  const cartModalContent = (
    <>
      <ul className={classes["cart-items"]}>{cartItems}</ul>
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {isOrdered && (
        <Checkout onConfirm={submitOrderHandler} onCancel={props.onClose} />
      )}
      {!isOrdered && modalActions}
    </>
  );

  const isSubmittingModalContent = <p>Sending order data...</p>;
  const didSubmitModalContent = (
    <>
      <p>Order was successfully sent.</p>
      <div className={classes.actions}>
        <button onClick={props.onClose} className={classes.button}>
          Close
        </button>
      </div>
    </>
  );

  return (
    <Modal onClose={props.onClose}>
      {!isSubmitting && !didSubmit && cartModalContent}
      {isSubmitting && isSubmittingModalContent}
      {!isSubmitting && didSubmit && didSubmitModalContent}
    </Modal>
  );
};

export default Cart;

// import Modal from "../UI/Modal";
// import classes from "./Cart.module.css";

// const Cart = (props) => {
//   const cartItems = (
//     <ul className={classes["cart-items"]}>
//       {[
//         {
//           id: "m1",
//           name: "Sushi",
//           amount: 3,
//           price: 12.59,
//         },
//       ].map((item) => (
//         <li>{item.name}</li>
//       ))}
//     </ul>
//   );
//   return (
//     <Modal>
//       {cartItems}
//       <div className={classes.total}>
//         <span>Total Amount</span>
//         <span>35.56</span>
//       </div>
//       <div className={classes.actions}>
//         <button className={classes["button--alt"]}>Close</button>
//         <button className={classes.button}>Order</button>
//       </div>
//     </Modal>
//   );
// };

// export default Cart;
