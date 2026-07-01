import type { Metadata } from "next";
import { Orbitron, Rajdhani } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rajdhani",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Blue Lamborghini Huracán | Scrollytelling Showcase",
  description: "Experience the design, chassis, and raw V10 performance of the Blue Lamborghini Huracán in an immersive, scroll-controlled interactive environment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${rajdhani.variable} antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (window.innerWidth < 1024) {
                  var metas = document.getElementsByTagName('meta');
                  for (var i = 0; i < metas.length; i++) {
                    if (metas[i].name === 'viewport') {
                      metas[i].parentNode.removeChild(metas[i]);
                    }
                  }
                  var meta = document.createElement('meta');
                  meta.name = 'viewport';
                  meta.content = 'width=1280, initial-scale=' + (window.screen.width / 1280) + ', maximum-scale=1.0, user-scalable=yes';
                  document.head.appendChild(meta);
                }
              })();
            `,
          }}
        />
      </head>
      <body className="bg-[#1a1a1a] text-white">
        {children}
      </body>
    </html>
  );
}

