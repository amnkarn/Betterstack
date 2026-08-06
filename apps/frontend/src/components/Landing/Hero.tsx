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

        {/* Landing mockup */}
        <div
          className="w-full max-w-4xl animate-fade-up"
          style={{ animationDelay: '380ms', opacity: 0 }}
        >
          <div className="rounded-2xl p-4 sm:p-8 glow-sm border border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            {/* Window controls */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <div className="ml-4 text-xs font-medium text-muted-foreground">pulsewatch.app / dashboard</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-background/40 border border-border/50 rounded-xl p-5 shadow-sm">
                <div className="text-sm text-muted-foreground mb-1">Global Uptime</div>
                <div className="text-3xl font-bold text-foreground font-mono">99.99%</div>
                <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> All systems operational
                </div>
              </div>
              <div className="bg-background/40 border border-border/50 rounded-xl p-5 shadow-sm">
                <div className="text-sm text-muted-foreground mb-1">Avg Response</div>
                <div className="text-3xl font-bold text-foreground font-mono">124<span className="text-xl text-muted-foreground ml-1">ms</span></div>
                <div className="text-xs text-sky-400 mt-2 flex items-center gap-1.5">
                  <span className="font-bold">↓</span> 12ms faster today
                </div>
              </div>
              <div className="bg-background/40 border border-border/50 rounded-xl p-5 shadow-sm">
                <div className="text-sm text-muted-foreground mb-1">Active Monitors</div>
                <div className="text-3xl font-bold text-foreground font-mono">24</div>
                <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                  Across 5 global regions
                </div>
              </div>
            </div>

            {/* Chart Area */}
            <div className="bg-background/40 border border-border/50 rounded-xl p-5 h-48 relative overflow-hidden flex flex-col shadow-sm">
              <div className="flex justify-between items-center mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium text-foreground">API Response Time</div>
                  <Badge variant="outline" className="text-[10px] h-5 border-primary/20 text-primary bg-primary/5">Live</Badge>
                </div>
                <div className="text-xs text-muted-foreground">Last 24 hours</div>
              </div>
              <div className="absolute inset-x-0 bottom-0 top-12">
                {/* Horizontal grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pt-2 pb-0">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-full h-[1px] bg-border/40" />
                  ))}
                </div>
                
                <svg className="w-full h-full relative z-10" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="mockupGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,100 L0,70 L10,65 L20,72 L30,68 L40,30 L45,68 L50,75 L60,70 L70,72 L80,65 L90,68 L100,70 L100,100 Z"
                    fill="url(#mockupGrad)"
                  />
                  <path
                    d="M0,70 L10,65 L20,72 L30,68 L40,30 L45,68 L50,75 L60,70 L70,72 L80,65 L90,68 L100,70"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Tooltip dot */}
                  <circle cx="40" cy="30" r="2.5" fill="#38bdf8" className="animate-pulse" />
                </svg>

                {/* Tooltip HTML */}
                <div className="absolute top-[15%] left-[42%] bg-card border border-border shadow-xl rounded-md px-2 py-1.5 text-xs z-20">
                  <div className="font-mono text-sky-400 font-bold">482 ms</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Spike detected</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
