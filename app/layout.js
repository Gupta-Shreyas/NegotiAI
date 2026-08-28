import "./globals.css";

export const metadata = {
  title: "Negotiating Capital Market",
  description: "Agentic supply-chain financing marketplace",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}