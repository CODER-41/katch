import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Twitter, Youtube, ShieldCheck } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-green-dark text-primary-foreground">
      <div className="container mx-auto section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="font-display font-bold text-lg text-primary-foreground">K</span>
              </div>
              <h3 className="font-display text-xl font-bold">Kakamega School</h3>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              A premier national school nurturing leaders since 1932. <em>"The School We Know"</em>
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm opacity-80">
              {[
                { label: "About Us", to: "/about" },
                { label: "Academics", to: "/academics" },
                { label: "Admissions", to: "/admissions" },
                { label: "Student Life", to: "/student-life" },
                { label: "Gallery", to: "/gallery" },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:opacity-100 transition-opacity">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/admin/login" className="flex items-center gap-1.5 hover:opacity-100 transition-opacity mt-1 pt-1 border-t border-primary/20">
                  <ShieldCheck className="w-3.5 h-3.5" /> Staff Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm opacity-80">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                P.O. Box 90-50100, Kakamega
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" />
                +254 759 340 116
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" />
                kakamegasch@gmail.com
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-3">
              {[Facebook, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/40 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            <p className="text-sm opacity-60 mt-6">
              Mon - Fri: 8:00 AM - 5:00 PM
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-primary/20 py-6 text-center text-sm opacity-60">
        <div className="container mx-auto px-4">
          © {new Date().getFullYear()} Kakamega High School. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
