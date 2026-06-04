export const channelPartners = [
  {
    name: "Delta",
    slug: "delta",
    // eyebrow: "What Our Delta Products",
    title: "There are many variations of products",
    description: "Delta product categories listed by Loyalty Automation for industrial automation applications.",
    products: [
      { name: "VFD", image: "/partners/delta/vfd.jpg" },
      { name: "AC Servo Package", image: "/partners/delta/ac.jpg" },
      { name: "PLC", image: "/partners/delta/c.jpg" },
      { name: "Communication cable & Converter", image: "/partners/delta/c1.jpg" },
      { name: "HMI/Text Panel", image: "/partners/delta/HMI.jpg" },
      { name: "Temperature Controller", image: "/partners/delta/temperature controller.jpg" },
      { name: "Power Supply", image: "/partners/delta/power.jpg" },
      { name: "Pressure Sensor", image: "/partners/delta/Pressure.jpg" },
      { name: "SCADA", image: "/partners/delta/scada.jpg" },
    ],
  },
  {
    name: "Motovario",
    slug: "motovario",
    // eyebrow: "What Our Motovario Products",
    title: "There are many variations of products",
    description: "Motovario products listed by Loyalty Automation for motor and gearbox requirements.",
    products: [{ name: "AC Motors & Gear Boxes", image: "/partners/motovario/123.jpg" }],
  },
  {
    name: "Phoenix Contact",
    slug: "phoenix-contact",
    // eyebrow: "Channel Partners",
    title: "There are many variations of products",
    description: "Phoenix Contact product categories listed by Loyalty Automation.",
    products: [
      { name: "Circular Connectors", image: "/partners/phoenix/circular connectors.jpg" },
      { name: "Controllers", image: "/partners/phoenix/controlers.jpg" },
      { name: "Device Circuit Breakers", image: "/partners/phoenix/device circuit brakers.jpg" },
      { name: "Energy and Power Measurement", image: "/partners/phoenix/Energy and power measurement.jpg" },
      { name: "Industrial Ethernet Switches", image: "/partners/phoenix/Industrial ethernet switches.jpg" },
      { name: "Industrial PC", image: "/partners/phoenix/industrial pc.jpg" },
      { name: "Relay Modules", image: "/partners/phoenix/relay modules.jpg" },
      { name: "Sensor and Actuator Cabling", image: "/partners/phoenix/Sensor and actuator cabling.jpg" },
      { name: "Surge Protection", image: "/partners/phoenix/Surge protection.jpg" },
      { name: "TRIO Power", image: "/partners/phoenix/trio power.jpg" },
    ],
  },
  {
    name: "Schneider Electric",
    slug: "schneider-electric",
    // eyebrow: "What Our Schneider Products",
    title: "There are many variations of products",
    description: "Schneider Electric product categories listed by Loyalty Automation.",
    products: [
      { name: "AC Drives", image: "/partners/schneider/as drives.jpg" },
      { name: "Soft Starter", image: "/partners/schneider/soft starter.jpg" },
      { name: "PLC", image: "/partners/schneider/plc.jpg" },
      { name: "HMI", image: "/partners/schneider/hMI.jpg" },
      { name: "SMPS", image: "/partners/schneider/smps.jpg" },
      { name: "Harmonics", image: "/partners/schneider/Harmonics.jpg" },
      { name: "Limit Switches & Joystick", image: "/partners/schneider/limit switch.jpg" },
    ],
  },
];

export function getChannelPartner(slug) {
  return channelPartners.find((partner) => partner.slug === slug);
}
