import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Notes from the Victory Fashion Design atelier in Ruiru: fabric guides, fitting advice, bridal planning and stories from the academy floor.",
  keywords: [
    "fashion blog Kenya",
    "fabric guide Kenya",
    "bridal planning Kenya",
    "tailoring tips",
  ],
  alternates: { canonical: "/journal" },
  openGraph: {
    title: "Journal — Victory Fashion Design",
    description:
      "Fabric guides, fitting advice and stories from our Ruiru atelier and academy.",
    url: "/journal",
  },
};

export default function JournalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
