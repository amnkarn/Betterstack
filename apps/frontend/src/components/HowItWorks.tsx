import { Badge } from '@/components/ui/Badge';
import { PlusCircle, Radio, Users, FileText } from 'lucide-react';

const steps = [
  {
    icon: PlusCircle,
    step: '01',
    title: 'Add your monitors',
    description:
      'Paste in a URL or configure a TCP, ping, or keyword check. Set your check interval from 30 seconds to 5 minutes.',
    detail: 'HTTP · HTTPS · TCP · Ping · Keyword · Cron · API',
  },
  {
    icon: Radio,
    step: '02',
    title: 'Set up alert channels',
    description:
      'Connect Slack, PagerDuty, email, SMS, or webhooks. Define escalation rules so the right person gets paged.',
    detail: 'Slack · PagerDuty · Email · SMS · Teams · Webhook',
  },
  {
    icon: Users,
    step: '03',
    title: 'Build your on-call rota',
    description:
      'Create schedules for your team so incidents always reach someone. Auto-escalate if no one acknowledges.',
    detail: 'Rotations · Overrides · Escalations · Follow-the-sun',
  },
  {
    icon: FileText,
    step: '04',
    title: 'Publish your status page',
    description:
      'Share a live status page with your customers. It updates automatically during incidents and keeps everyone informed.',
    detail: 'Custom domain · Branded · Subscriber emails · History',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-sky-500/5 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sky-400 font-medium text-sm uppercase tracking-widest mb-3">
            How it works
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            Up and running in minutes
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            No complex setup. No DevOps required. Get full observability in four simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent" />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.step} className="relative flex flex-col">
                {/* Step number + icon */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative z-10 w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center mb-3 hover:border-sky-500/60 hover:bg-sky-500/15 transition-all group">
                    <Icon className="w-7 h-7 text-sky-400 group-hover:scale-110 transition-transform" />
                    <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-sky-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-white font-semibold text-lg mb-2 text-center">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed text-center mb-4">
                  {step.description}
                </p>
                <div className="mt-auto flex flex-wrap gap-1.5 justify-center">
                  {step.detail.split(' · ').map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-[11px] bg-white/5 text-muted-foreground border-border px-2 py-0.5"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
