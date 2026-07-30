import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Marcus Holt',
    role: 'CTO at Flowbase',
    avatar: 'MH',
    quote:
      "We switched from PagerDuty + Pingdom to Betteruptime and cut our tooling cost by 60%. The on-call scheduling alone is worth it — our engineers actually sleep now.",
    stars: 5,
  },
  {
    name: 'Sarah Chen',
    role: 'Head of Infrastructure, Layerly',
    avatar: 'SC',
    quote:
      'The status page feature is gorgeous. Our customers stopped emailing support during outages because they can just check the page. It saves us hours per incident.',
    stars: 5,
  },
  {
    name: 'Dmitri Sokolov',
    role: 'Solo founder, NoteStack',
    avatar: 'DS',
    quote:
      "As a solo dev, Betteruptime's free plan is insane value. I get alerted on my phone within seconds whenever my app goes down. Set it up in under 10 minutes.",
    stars: 5,
  },
  {
    name: 'Priya Nair',
    role: 'SRE Lead, Syncraft',
    avatar: 'PN',
    quote:
      "We monitor 200+ endpoints globally and Betteruptime handles it without breaking a sweat. The 30-second check interval and multi-region alerts are game changers for us.",
    stars: 5,
  },
  {
    name: 'Tom Erikson',
    role: 'Engineering Manager, Pulsar',
    avatar: 'TE',
    quote:
      "Incident management used to be chaotic Slack threads. Now we have a structured timeline, clear ownership, and postmortems. The whole team is more confident.",
    stars: 5,
  },
  {
    name: 'Amara Diallo',
    role: 'DevOps Engineer, Mercado',
    avatar: 'AD',
    quote:
      "SSL expiry alerts saved us twice already. We had a cert about to expire and got the warning 30 days out. Genuinely can't imagine managing infra without this now.",
    stars: 5,
  },
];

const avatarColors = [
  'bg-blue-500/10 text-blue-500',
  'bg-emerald-500/10 text-emerald-500',
  'bg-violet-500/10 text-violet-500',
  'bg-amber-500/10 text-amber-500',
  'bg-rose-500/10 text-rose-500',
  'bg-indigo-500/10 text-indigo-500',
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-[500px] h-[400px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <p className="text-primary font-medium text-sm uppercase tracking-widest mb-4">
            Testimonials
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Loved by reliability teams
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Thousands of engineers trust Betteruptime to keep their services running.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="group p-10 rounded-2xl border border-border/50 bg-card/50 hover:border-primary/30 hover:bg-secondary/20 transition-all duration-300 backdrop-blur-sm shadow-sm hover:shadow-md"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array(t.stars)
                  .fill(0)
                  .map((_, si) => (
                    <Star key={si} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
              </div>

              {/* Quote */}
              <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-1">
                "{t.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full ${avatarColors[i]} flex items-center justify-center text-xs font-bold shrink-0 shadow-sm border border-border/50`}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-foreground text-sm font-semibold">{t.name}</div>
                  <div className="text-muted-foreground text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social proof bar */}
        <div className="mt-20 py-10 border-y border-border grid grid-cols-2 sm:grid-cols-4 gap-8 text-center bg-card/30 backdrop-blur-sm">
          {[
            { value: '12,000+', label: 'Teams monitoring' },
            { value: '4.9/5', label: 'Average rating' },
            { value: '2.1B+', label: 'Checks per month' },
            { value: '99.99%', label: 'Platform uptime' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl sm:text-3xl font-extrabold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
