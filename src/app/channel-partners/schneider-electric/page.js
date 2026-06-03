import ChannelPartnerDetail from "../../components/ChannelPartnerDetail";
import { getChannelPartner } from "../../lib/channelPartners";
import { createMetadata } from "../../lib/seo";

export const metadata = createMetadata({
  title: "Schneider Electric Automation Products",
  description: "Browse Schneider Electric AC drives, soft starters, PLC, HMI, SMPS, harmonics, limit switch, and joystick product categories.",
  path: "/channel-partners/schneider-electric",
});

export default function SchneiderElectricPage() {
  return <ChannelPartnerDetail partner={getChannelPartner("schneider-electric")} />;
}
