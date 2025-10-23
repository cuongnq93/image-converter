import type { Route } from "./+types/home";
import { ImageConverter } from "../components/ImageConverter";

export function meta({}: Route.MetaArgs) {
  const title = "Image Converter & Optimizer - Fast, Free & Privacy-First";
  const description = "Convert images between formats (JPEG, PNG, WebP, AVIF) with advanced psychovisual compression. Process locally in your browser - no uploads, completely private and secure.";
  const imageUrl = "/og.image.jpg";

  return [
    { title },
    { name: "description", content: description },

    // Open Graph / Facebook
    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: imageUrl },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: "Image Converter & Optimizer Interface" },

    // Twitter Card
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: imageUrl },
    { name: "twitter:image:alt", content: "Image Converter & Optimizer Interface" },

    // Additional Meta
    { name: "keywords", content: "image converter, image optimizer, webp converter, avif converter, jpeg to png, image compression, psychovisual compression" },
    { name: "author", content: "Image Converter" },
    { name: "theme-color", content: "#3B82F6" },
  ];
}

export default function Home() {
  return <ImageConverter />;
}
