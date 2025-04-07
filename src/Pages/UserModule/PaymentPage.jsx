import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { stripePromise } from "../../Config/Stripe";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  // Get clientSecret from location.state
  useEffect(() => {
    if (location.state?.clientSecret) {
      setClientSecret(location.state.clientSecret);
    } else {
      setError("No client secret provided.");
    }
  }, [location.state]);

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError("Stripe is not ready yet.");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    console.log("CardElement:", cardElement); // Debugging: Check if CardElement is loaded

    // if (!cardElement) {
    //   setError("Card element is not loaded.");
    //   return;
    // }

    try {
      setLoading(true);

      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        navigate("/payment-success");
      } else {
        setError("Payment failed. Please try again.");
      }
    } catch (err) {
      console.error("Payment Error:", err);
      setError("Payment processing failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Elements stripe={stripePromise}>
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
        <div
          style={{
            maxWidth: "400px",
            width: "100%",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            background: "#fff",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Complete Your Payment</h2>
          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
          {clientSecret ? (
            <form onSubmit={handlePayment}>
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#333",
                      "::placeholder": { color: "#888" },
                    },
                  },
                }}
              />
              <button
                type="submit"
                disabled={!stripe || loading}
                style={{
                  marginTop: "20px",
                  width: "100%",
                  padding: "10px 0",
                  background: "#27ae60",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                {loading ? "Processing..." : "Pay Now"}
              </button>
            </form>
          ) : (
            <p style={{ color: "red", textAlign: "center" }}>Unable to load payment form.</p>
          )}
        </div>
      </div>
    </Elements>
  );
};

export default PaymentPage;
