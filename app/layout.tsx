import "./globals.css";

export const metadata = {
  title: "CreatorFlow",
  description: "Automated contributor payouts on Bitcoin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}