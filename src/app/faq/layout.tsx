import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers on turnaround times, measurements, fittings, pricing, M-Pesa payment, delivery and academy enrolment at Victory Fashion Design in Ruiru.",
  keywords: [
    "tailoring turnaround time Kenya",
    "how to take measurements",
    "M-Pesa payment tailor",
    "fashion course fees Kenya",
  ],
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "Frequently Asked Questions — Victory Fashion Design",
    description:
      "Turnaround times, fittings, pricing, M-Pesa payment, delivery and academy enrolment, answered.",
    url: "/faq",
  },
};

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
