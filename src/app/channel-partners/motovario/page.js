import ChannelPartnerDetail from "../../components/ChannelPartnerDetail";
import { getChannelPartner } from "../../lib/channelPartners";
import { createMetadata } from "../../lib/seo";

export const metadata = createMetadata({
  title: "Motovario Motors and Gearboxes",
  description: "Browse Motovario AC motor and gearbox product categories listed by Loyalty Automation for industrial applications.",
  path: "/channel-partners/motovario",
});

export default function MotovarioPage() {
  return <ChannelPartnerDetail partner={getChannelPartner("motovario")} />;
}
