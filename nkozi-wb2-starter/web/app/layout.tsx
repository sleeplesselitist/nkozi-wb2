export const metadata = { title: "Nkozi MVP", description: "Human-verified music discovery" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0 }}>
        <nav style={{ padding: "12px 16px", borderBottom: "1px solid #eee" }}>
          <a href="/" style={{ marginRight: 12 }}>Home</a>
          <a href="/upload" style={{ marginRight: 12 }}>Upload</a>
          <a href="/feed" style={{ marginRight: 12 }}>Feed</a>
          <a href="/dashboard">Dashboard</a>
        </nav>
        <div style={{ padding: 16 }}>{children}</div>
      </body>
    </html>
  );
}
