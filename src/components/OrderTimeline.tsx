import React from "react";
import { Check, Clock, Package, Truck, Gift, ShieldCheck } from "lucide-react";

interface OrderTimelineProps {
  status: string; // "pending" | "confirmed" | "processing" | "shipping" | "delivered" | "completed"
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ status }) => {
  const normStatus = (status || "pending").toLowerCase();

  // Map backend status to 1-5 step index
  const getActiveStep = () => {
    switch (normStatus) {
      case "pending":
        return 1;
      case "confirmed":
        return 2;
      case "processing":
        return 3;
      case "shipping":
        return 4;
      case "delivered":
      case "completed":
        return 5;
      default:
        return 2;
    }
  };

  const currentStep = getActiveStep();

  const steps = [
    { id: 1, title: "Order Placed", desc: "Order submitted", icon: Clock },
    { id: 2, title: "Confirmed", desc: "Payment verified", icon: ShieldCheck },
    { id: 3, title: "Processing", desc: "Packing products", icon: Package },
    { id: 4, title: "Shipping", desc: "Out for delivery", icon: Truck },
    { id: 5, title: "Delivered", desc: "Package received", icon: Gift },
  ];

  return (
    <div className="py-3 px-2">
      {/* Desktop & Tablet Horizontal Timeline */}
      <div className="position-relative d-none d-md-block my-3">
        {/* Progress Background Line */}
        <div
          className="position-absolute top-50 start-0 translate-middle-y w-100 bg-secondary bg-opacity-25"
          style={{ height: "4px", zIndex: 0 }}
        ></div>

        {/* Active Progress Colored Line */}
        <div
          className="position-absolute top-50 start-0 translate-middle-y bg-primary transition"
          style={{
            height: "4px",
            zIndex: 1,
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            transition: "width 0.4s ease-in-out",
          }}
        ></div>

        {/* Step Nodes */}
        <div className="d-flex justify-content-between position-relative" style={{ zIndex: 2 }}>
          {steps.map((st) => {
            const isCompleted = currentStep > st.id;
            const isCurrent = currentStep === st.id;
            const IconComponent = st.icon;

            return (
              <div key={st.id} className="text-center" style={{ width: "110px" }}>
                <div
                  className={`rounded-circle mx-auto d-flex align-items-center justify-content-center shadow-sm transition ${
                    isCompleted
                      ? "bg-primary text-white border border-2 border-primary"
                      : isCurrent
                      ? "bg-white text-primary border border-3 border-primary"
                      : "bg-white text-muted border border-2 border-secondary border-opacity-25"
                  }`}
                  style={{ width: "42px", height: "42px" }}
                >
                  {isCompleted ? <Check size={20} className="fw-bold" /> : <IconComponent size={20} />}
                </div>

                <div className="mt-2">
                  <div className={`small fw-bold ${isCurrent ? "text-primary" : isCompleted ? "text-dark" : "text-muted"}`}>
                    {st.title}
                  </div>
                  <div className="text-muted" style={{ fontSize: "11px" }}>
                    {st.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Vertical Timeline */}
      <div className="d-md-none vstack gap-3 my-2">
        {steps.map((st) => {
          const isCompleted = currentStep > st.id;
          const isCurrent = currentStep === st.id;
          const IconComponent = st.icon;

          return (
            <div key={st.id} className="d-flex align-items-center gap-3">
              <div
                className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 shadow-xs ${
                  isCompleted
                    ? "bg-primary text-white"
                    : isCurrent
                    ? "bg-white text-primary border border-2 border-primary"
                    : "bg-light text-muted border"
                }`}
                style={{ width: "36px", height: "36px" }}
              >
                {isCompleted ? <Check size={18} /> : <IconComponent size={18} />}
              </div>
              <div className="flex-grow-1">
                <div className={`fw-bold small ${isCurrent ? "text-primary" : isCompleted ? "text-dark" : "text-muted"}`}>
                  {st.title}
                </div>
                <div className="text-muted" style={{ fontSize: "11px" }}>
                  {st.desc}
                </div>
              </div>
              {isCurrent && (
                <span className="badge bg-primary-subtle text-primary rounded-pill px-2 py-1 small">
                  In Progress
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
