"use client";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ShippingAddress } from "@/lib/checkout";
import { MapPin } from "lucide-react";

type Props = {
  value: ShippingAddress;
  onChange: (value: ShippingAddress) => void;
  saveAddress: boolean;
  onToggleSaveAddress: (v: boolean) => void;
};

export function ShippingForm({
  value,
  onChange,
  saveAddress,
  onToggleSaveAddress,
}: Props) {
  const update = (field: keyof ShippingAddress, v: string) => {
    onChange({ ...value, [field]: v });
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-full bg-(--colour-primary)/10">
          <MapPin className="w-5 h-5 text-(--colour-primary)" />
        </div>
        <h2 className="text-lg font-semibold">Shipping Address</h2>
      </div>

      <div className="space-y-3">
        <Input
          placeholder="Street Address"
          value={value.street}
          onChange={(e) => update("street", e.target.value)}
          className="bg-background"
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            placeholder="City"
            value={value.city}
            onChange={(e) => update("city", e.target.value)}
            className="bg-background"
          />
          <Input
            placeholder="State"
            value={value.state}
            onChange={(e) => update("state", e.target.value)}
            className="bg-background"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input
            placeholder="Zip Code"
            value={value.zipCode}
            onChange={(e) => update("zipCode", e.target.value)}
            className="bg-background"
          />
          <Input
            placeholder="Country"
            value={value.country}
            onChange={(e) => update("country", e.target.value)}
            className="bg-background"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <Checkbox
          id="save-address"
          className="border-2 border-muted-foreground data-[state=checked]:bg-(--colour-primary) data-[state=checked]:border-(--colour-primary)"
          checked={saveAddress}
          onCheckedChange={(v) => onToggleSaveAddress(Boolean(v))}
        />
        <label
          htmlFor="save-address"
          className="text-sm text-muted-foreground cursor-pointer"
        >
          Save this address for future orders
        </label>
      </div>
    </div>
  );
}
