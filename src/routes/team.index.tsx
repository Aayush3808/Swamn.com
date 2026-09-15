import { createFileRoute } from "@tanstack/react-router";
import { MemberLogin } from "@/components/swamn/MemberLogin";

export const Route = createFileRoute("/team/")({
  head: () => ({
    meta: [
      { title: "Team Login — SWAMN" },
      { name: "description", content: "Private SWAMN team workspace login." },
      { property: "og:title", content: "Team Login — SWAMN" },
      { property: "og:description", content: "Private SWAMN team workspace login." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MemberLogin,
});
