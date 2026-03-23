import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { PublicLayout } from "@/components/PublicLayout";
import { Footer } from "@/components/Footer";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: {
    default: "이음(IEUM) - 경남과학고 IT 동아리",
    template: "%s | 이음(IEUM)",
  },
  description:
    "경남과학고 IT 동아리 이음(IEUM)의 공식 홈페이지입니다. gshs.app을 비롯한 다양한 서비스를 개발하고 있습니다.",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://ieum.gshs.app",
    siteName: "이음(IEUM)",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const applySettings = await prisma.siteContent.findMany({
    where: { key: { in: ["apply_enabled", "apply_deadline"] } },
  });
  const applyMap: Record<string, string> = {};
  applySettings.forEach((i) => { applyMap[i.key] = i.value; });
  const applyEnabled = applyMap["apply_enabled"] !== "false";
  const applyDeadline = applyMap["apply_deadline"] ?? "";

  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <PublicLayout applyEnabled={applyEnabled} applyDeadline={applyDeadline} footer={<Footer />}>
              {children}
            </PublicLayout>
          </div>
        </Providers>
      </body>
    </html>
  );
}
