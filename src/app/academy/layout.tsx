import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fashion Design Academy",
  description:
    "Learn professional fashion design and tailoring in Ruiru. Pattern drafting, garment construction and business skills taught by a Master Tailor with 20 years of experience.",
  keywords: [
    "fashion school Ruiru",
    "tailoring course Kenya",
    "fashion design classes Nairobi",
    "learn dressmaking Kenya",
    "pattern drafting course",
  ],
  alternates: { canonical: "/academy" },
  openGraph: {
    title: "Fashion Design Academy — Victory Fashion Design",
    description:
      "Professional fashion design and tailoring courses in Ruiru, taught by a Master Tailor.",
    url: "/academy",
  },
};

export default function AcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
