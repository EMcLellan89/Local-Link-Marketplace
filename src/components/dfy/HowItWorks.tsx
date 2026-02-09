interface HowItWorksProps {
  slaHours: number;
}

export default function HowItWorks({ slaHours }: HowItWorksProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold">How it works</h2>
      <div className="mt-3 grid md:grid-cols-3 gap-4">
        <div className="border rounded-2xl p-4">
          <div className="text-sm text-gray-500">Step 1</div>
          <div className="font-medium mt-1">Checkout</div>
          <div className="text-gray-600 mt-2">Secure checkout through Local-Link.</div>
        </div>
        <div className="border rounded-2xl p-4">
          <div className="text-sm text-gray-500">Step 2</div>
          <div className="font-medium mt-1">Intake form</div>
          <div className="text-gray-600 mt-2">3–5 minutes to give us what we need.</div>
        </div>
        <div className="border rounded-2xl p-4">
          <div className="text-sm text-gray-500">Step 3</div>
          <div className="font-medium mt-1">We build & launch</div>
          <div className="text-gray-600 mt-2">Most tools go live within {slaHours} hours.</div>
        </div>
      </div>
    </div>
  );
}
