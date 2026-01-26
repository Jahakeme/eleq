// this define specific interfaces for Paystack
interface PaystackResponse {
  reference: string;
  status: string;
}

interface PaystackPopOptions {
  key: string;
  email: string;
  amount: number;
  ref: string;
  callback: (response: PaystackResponse) => void;
  onClose: () => void;
  currency?: string;
}

//this define the shape of the window object just for this file
interface PaystackWindow extends Window {
  PaystackPop: {
    setup: (options: PaystackPopOptions) => {
      openIframe: () => void;
    };
  };
}

export const usePaystack = () => {
  const loadPaystack = (
    email: string,
    amount: number,
    reference: string,
    onSuccess: (ref: PaystackResponse) => void,
  ) => {
    const paystackWindow = window as unknown as PaystackWindow;

    if (typeof window !== "undefined" && paystackWindow.PaystackPop) {
      const handler = paystackWindow.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY as string,
        email,
        amount: Math.round(amount * 100),
        ref: reference,
        callback: (response: PaystackResponse) => onSuccess(response),
        onClose: () => console.log("Payment window closed"),
      });

      handler.openIframe();
    } else {
      console.error(
        "Paystack SDK not found. Ensure the script is in layout.tsx",
      );
    }
  };

  return { loadPaystack };
};
