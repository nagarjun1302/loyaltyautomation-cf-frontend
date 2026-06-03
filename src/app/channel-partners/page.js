import ChannelPartnersPage from "./ChannelPartnersPageClient";
import { createMetadata } from "../lib/seo";

export const metadata = createMetadata({
  title: "Channel Partners | Loyalty Automation",
  description: "Explore Loyalty Automation channel partner product ranges from Delta, Schneider Electric, Phoenix Contact, and Motovario.",
  path: "/channel-partners",
});

export default function Page() {
  return <ChannelPartnersPage />;
}
