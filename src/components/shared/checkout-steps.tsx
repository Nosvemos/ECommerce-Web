import React from "react"
import { cn } from "@/lib/utils";
import { User, Truck, CreditCard, CheckCheck } from 'lucide-react'

const steps = [
  { name: 'User Login', icon: User },
  { name: 'Shipping Address', icon: Truck },
  { name: 'Payment Method', icon: CreditCard },
  { name: 'Place Order', icon: CheckCheck },
];

const CheckoutSteps = ({ current = 0 }) => {
  return (
    <div className="w-full max-w-xl mx-auto mb-10">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.name}>
            <div className="flex flex-col items-center">
              <div className={cn('flex items-center justify-center size-12 rounded-full transition-colors',
                index <= current ? "bg-primary text-white dark:text-black" : "bg-secondary")}
              >
                {React.createElement(step.icon, { size: 20 })}
              </div>
              <span className={cn('mt-2 text-xs text-center', index === current ? "font-bold" : "")}>
                {step.name}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div className="hidden sm:block w-full max-w-20">
                <hr className={cn('h-[2px]', index < current ? "bg-primary" : "bg-secondary")}>
                </hr>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default CheckoutSteps