import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const statusBars = [
  { label: 'API', uptime: '99.99%', bars: Array(30).fill(1).map((_, i) => (i === 12 ? 0.3 : 1)) },
  { label: 'Dashboard', uptime: '100%', bars: Array(30).fill(1) },
  { label: 'Webhooks', uptime: '99.97%', bars: Array(30).fill(1).map((_, i) => (i === 5 ? 0.5 : i === 6 ? 0.4 : 1)) },
  { label: 'Auth Service', uptime: '99.99%', bars: Array(30).fill(1) },
];

const metrics = [
  { value: '99.99%', label: 'Avg Uptime' },
  { value: '<30s', label: 'Alert Time' },
  { value: '180+', label: 'Locations' },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] rounded-full bg-primary/5 blur-3xl" />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center">
        {/* Pill badge */}
        <div className="mb-6 animate-fade-up" style={{ animationDelay: '0ms' }}>
          <Badge className="bg-primary/10 text-primary border border-primary/30 px-6 py-2 text-sm font-medium hover:bg-primary/20 rounded-full transition-colors">
            <Zap className="w-3.5 h-3.5 mr-1.5 fill-primary" />
            Uptime monitoring, reimagined
          </Badge>
        </div>

        {/* Headline */}
        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6 animate-fade-up text-foreground"
          style={{ animationDelay: '80ms', opacity: 0 }}
        >
          Know when your site
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">goes down first.</span>
        </h1>

        {/* Sub */}
        <p
          className="max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10 animate-fade-up"
          style={{ animationDelay: '160ms', opacity: 0 }}
        >
          Betteruptime monitors your websites, APIs, and services from 180+ locations worldwide. Get
          instant alerts via SMS, Slack, or email — and let your users know with a beautiful status
          page.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row gap-4 mb-16 animate-fade-up"
          style={{ animationDelay: '240ms', opacity: 0 }}
        >
          <Link to={"/auth"}>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground glow px-8 text-base font-semibold h-14 rounded-xl">
              Start monitoring free
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary/50 h-14 text-base rounded-xl px-8 transition-colors">
            View live demo
          </Button>
        </div>

        {/* Trust signals */}
        <div
          className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-20 animate-fade-up"
          style={{ animationDelay: '300ms', opacity: 0 }}
        >
          {['No credit card required', 'Free forever plan', 'Setup in 60 seconds'].map((t) => (
            <span key={t} className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              {t}
            </span>
          ))}
        </div>

        {/* Landin mockup */}
        <div
          className="w-full max-w-4xl animate-fade-up"
          style={{ animationDelay: '380ms', opacity: 0 }}
        >
          <div className="rounded-2xl p-10 glow border border-border/50 bg-card/50 backdrop-blur-md">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium text-foreground">All systems operational</span>
              </div>
              <div className="flex items-center gap-4">
                {metrics.map((m) => (
                  <div key={m.label} className="text-center hidden sm:block">
                    <div className="text-sm font-bold text-foreground">{m.value}</div>
                    <div className="text-xs text-muted-foreground">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status rows */}
            <div className="space-y-4">
              {statusBars.map((service) => (
                <div key={service.label} className="flex items-center gap-4">
                  <div className="w-28 text-left">
                    <span className="text-sm text-muted-foreground">{service.label}</span>
                  </div>
                  <div className="flex-1 flex gap-0.5 items-end h-8">
                    {service.bars.map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm transition-all"
                        style={{
                          height: `${h * 100}%`,
                          backgroundColor:
                            h === 1
                              ? 'hsl(142 71% 45%)'
                              : h > 0.4
                              ? 'hsl(38 92% 50%)'
                              : 'hsl(0 72% 51%)',
                          opacity: 0.8 + i * 0.007,
                        }}
                      />
                    ))}
                  </div>
                  <div className="w-16 text-right">
                    <span className="text-xs font-mono text-muted-foreground">{service.uptime}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom legend */}
            <div className="flex gap-4 mt-5 pt-4 border-t border-border">
              {[
                { color: 'bg-green-400', label: 'Operational' },
                { color: 'bg-yellow-500', label: 'Degraded' },
                { color: 'bg-red-500', label: 'Outage' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className={`w-2 h-2 rounded-sm ${item.color}`} />
                  {item.label}
                </div>
              ))}
              <span className="ml-auto text-xs text-muted-foreground">Last 90 days</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
