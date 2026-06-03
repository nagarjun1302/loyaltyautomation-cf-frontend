import ChannelPartnerDetail from "../../components/ChannelPartnerDetail";
import { getChannelPartner } from "../../lib/channelPartners";
import { createMetadata } from "../../lib/seo";

export const metadata = createMetadata({
  title: "Delta Automation Products",
  description: "Browse Delta VFD, AC servo packages, PLC, HMI, temperature controller, power supply, pressure sensor, and SCADA product categories.",
  path: "/channel-partners/delta",
});

export default function DeltaPage() {
  return <ChannelPartnerDetail partner={getChannelPartner("delta")} />;
}
