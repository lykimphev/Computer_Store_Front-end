import React from 'react';
import { Wrench, Cpu, ShieldCheck, HardDrive, Monitor, Headphones, CheckCircle } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const servicesList = [
    {
      icon: <Wrench size={32} className="text-primary" />,
      title: "PC Repair & Hardware Diagnostics",
      desc: "Comprehensive hardware troubleshooting, motherboard repair, GPU thermal repasting, and component replacement.",
      features: ["Free initial diagnostic check", "Express 24h repair option", "Original replacement parts"]
    },
    {
      icon: <Cpu size={32} className="text-primary" />,
      title: "Custom PC Assembly & Cable Management",
      desc: "Professional custom gaming and workstation PC building with custom water cooling loops and clean cable routing.",
      features: ["Custom RGB & Aesthetic loops", "Stress testing & benchmarking", "Socket compatibility verification"]
    },
    {
      icon: <ShieldCheck size={32} className="text-primary" />,
      title: "OS Installation & Drivers Setup",
      desc: "Genuine Windows 11 installation, full driver optimization, BIOS updating, and essential software configuration.",
      features: ["Windows 11 Pro activation", "Latest GPU & Chipset drivers", "Malware & virus protection"]
    },
    {
      icon: <HardDrive size={32} className="text-primary" />,
      title: "Data Recovery & SSD Upgrade",
      desc: "Safely clone your existing hard drive to high-speed NVMe M.2 SSD or recover lost data from damaged storage drives.",
      features: ["Zero data loss cloning", "Up to 7000MB/s NVMe speeds", "Deep sector data recovery"]
    },
    {
      icon: <Monitor size={32} className="text-primary" />,
      title: "Laptop Cleaning & Thermal Maintenance",
      desc: "Dust cleaning, fan replacement, and high-performance thermal paste (Honeywell PTM7950 / Noctua NT-H2) application.",
      features: ["Reduces gaming temperatures up to 15°C", "Quieter fan noise", "Prevents thermal throttling"]
    },
    {
      icon: <Headphones size={32} className="text-primary" />,
      title: "On-Site IT Tech Support & Networking",
      desc: "Office network setup, Wi-Fi 6 router configuration, multi-PC setup, and ongoing tech support for business clients.",
      features: ["Phnom Penh area coverage", "High-speed mesh Wi-Fi setup", "Dedicated IT support engineer"]
    }
  ];

  return (
    <div className="container py-5">
      {/* Hero Section */}
      <div className="text-center mb-5 py-4">
        <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-bold mb-3 fs-6">
          <Wrench size={16} className="me-1" /> Professional Tech Support
        </span>
        <h1 className="fw-bold display-5 text-dark">Our Repair & Tech Services</h1>
        <p className="lead text-secondary mx-auto" style={{ maxWidth: '680px' }}>
          KP Computer Store provides certified computer maintenance, custom PC building, hardware repair, and IT solutions in Phnom Penh.
        </p>
      </div>

      {/* Services Grid */}
      <div className="row g-4 mb-5">
        {servicesList.map((service, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100 border-0 shadow-sm rounded-4 p-4 hover-shadow transition">
              <div className="p-3 bg-light rounded-4 d-inline-block mb-3" style={{ width: 'fit-content' }}>
                {service.icon}
              </div>
              <h4 className="fw-bold text-dark fs-5 mb-2">{service.title}</h4>
              <p className="text-secondary small mb-4">{service.desc}</p>
              <div className="mt-auto border-top pt-3">
                {service.features.map((feat, i) => (
                  <div key={i} className="d-flex align-items-center gap-2 small text-dark mb-1">
                    <CheckCircle size={14} className="text-success flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Book Service Banner */}
      <div className="bg-primary text-white rounded-4 p-5 text-center shadow-lg position-relative overflow-hidden" style={{ backgroundColor: '#1877F2' }}>
        <h2 className="fw-bold mb-3">Need PC Repair or Custom Assembly?</h2>
        <p className="opacity-90 mb-4 mx-auto fs-5" style={{ maxWidth: '600px' }}>
          Bring your PC to our store or contact our technical team on Telegram for instant assistance.
        </p>
        <div className="d-flex flex-wrap justify-content-center gap-3">
          <a href="https://t.me/kp_computer" target="_blank" rel="noreferrer" className="btn btn-light rounded-pill px-4 py-2.5 fw-bold text-primary shadow-sm">
            Contact Technical Team on Telegram
          </a>
        </div>
      </div>
    </div>
  );
};
