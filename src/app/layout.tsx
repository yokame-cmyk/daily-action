import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/authContext";
import { RecordProvider } from "@/lib/recordContext";
import Shell from "@/components/Shell";

export const metadata: Metadata = {
  title: "Daily Action",
  description: "日報・行動改善システム",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <AuthProvider>
          <RecordProvider>
            <Shell>{children}</Shell>
          </RecordProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
