import ChannelPartnerDetail from "../../components/ChannelPartnerDetail";
import { getChannelPartner } from "../../lib/channelPartners";
import { createMetadata } from "../../lib/seo";

export const metadata = createMetadata({
  title: "Phoenix Contact Industrial Products",
  description: "Browse Phoenix Contact industrial product categories including controllers, power supplies, relays, Ethernet switches, connectors, and surge protection.",
  path: "/channel-partners/phoenix-contact",
});

export default function PhoenixContactPage() {
  return <ChannelPartnerDetail partner={getChannelPartner("phoenix-contact")} />;
}
