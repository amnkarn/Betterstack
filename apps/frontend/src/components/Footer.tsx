import { Button } from './ui/Button';
import { Activity, ArrowRight } from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa"

const footerLinks = {
  Product: ['Features', 'Pricing', 'Changelog', 'Roadmap', 'Status'],
  Resources: ['Documentation', 'API Reference', 'Integrations', 'Blog', 'Guides'],
  Company: ['About', 'Careers', 'Contact', 'Press', 'Partners'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Security', 'GDPR', 'Cookies'],
};

export default function Footer() {
  return (
    <>
      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-sky-500/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-sky-500/10 blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass rounded-3xl px-8 py-16 glow">
            <div className="inline-flex w-16 h-16 rounded-2xl bg-sky-500/20 border border-sky-500/40 items-center justify-center mb-6 mx-auto">
              <Activity className="w-8 h-8 text-sky-400" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Start monitoring
              <br />
              <span className="text-gradient">in 60 seconds.</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
              Join 12,000+ teams who rely on PulseWatch to protect their uptime and keep their
              customers happy.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                className="bg-sky-500 hover:bg-sky-400 text-white glow px-10 text-base h-12 font-semibold"
              >
                Create free account
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border text-muted-foreground hover:text-white hover:border-sky-500/50 h-12 text-base"
              >
                Talk to sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2">
              <a href="#" className="flex items-center gap-2 mb-4 group w-fit">
                <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-white text-lg">PulseWatch</span>
              </a>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5 max-w-[220px]">
                Uptime monitoring and incident management for modern teams.
              </p>
              <div className="flex gap-3">
                {[FaTwitter, FaGithub, FaLinkedin].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-8 h-8 rounded-lg border border-border hover:border-sky-500/50 flex items-center justify-center text-muted-foreground hover:text-white transition-all"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-white font-semibold text-sm mb-4">{category}</h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground hover:text-white transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} PulseWatch, Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
