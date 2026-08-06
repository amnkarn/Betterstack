import {
  Bell,
  Globe,
  LayoutDashboard,
  Clock,
  Shield,
  Webhook,
  SmartphoneNfc,
  BarChart3,
} from 'lucide-react';

const features = [
  {
    icon: Globe,
    title: 'Global Monitoring',
    description:
      'Check your services from 180+ locations worldwide. Detect regional outages before your customers do.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Bell,
    title: 'Instant Alerts',
    description:
      'Get notified in under 30 seconds via SMS, Slack, Teams, PagerDuty, email, or webhooks.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: LayoutDashboard,
    title: 'Public Status Pages',
    description:
      'Create beautiful, branded status pages that automatically update when incidents occur.',
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
  },
  {
    icon: Clock,
    title: 'On-Call Scheduling',
    description:
      'Build smart on-call rotations so the right person is always paged at the right time.',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: Shield,
    title: 'SSL Monitoring',
    description:
      'Get alerted before your SSL certificates expire. Never let an expired cert bring down your site.',
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
  },
  {
    icon: Webhook,
    title: 'Incident Management',
    description:
      'Track, manage, and resolve incidents with a built-in timeline, postmortems, and team collaboration.',
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
  },
  {
    icon: SmartphoneNfc,
    title: 'SMS & Voice Calls',
    description:
      'Escalate critical incidents with phone calls and SMS so urgent alerts never get missed.',
    color: 'text-pink-500',
    bg: 'bg-pink-500/10',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description:
      'Detailed response time charts, uptime reports, and SLA tracking across all your monitors.',
    color: 'text-teal-500',
    bg: 'bg-teal-500/10',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-32 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-24">
          <p className="text-primary font-medium text-sm uppercase tracking-widest mb-4">
            Everything you need
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Built for reliability teams
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            One platform to monitor, alert, and communicate — so your team can focus on fixing
            problems, not finding them.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="group p-10 rounded-2xl border border-border/50 bg-card/50 hover:border-primary/40 hover:bg-secondary/20 transition-all duration-300 backdrop-blur-sm"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl ${feat.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${feat.color}`} />
                </div>
                <h3 className="text-foreground font-semibold mb-3 text-lg">{feat.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
