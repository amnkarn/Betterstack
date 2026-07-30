import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Check, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Hobby',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'For personal projects and tinkerers.',
    cta: 'Get started free',
    ctaVariant: 'outline' as const,
    features: [
      '5 monitors',
      '3-minute check interval',
      'Email alerts',
      '1 status page',
      '30-day history',
      '1 team member',
    ],
    highlighted: false,
  },
  {
    name: 'Starter',
    monthlyPrice: 29,
    yearlyPrice: 22,
    description: 'For growing teams that need reliability.',
    cta: 'Start free trial',
    ctaVariant: 'default' as const,
    features: [
      '50 monitors',
      '1-minute check interval',
      'SMS + Email + Slack alerts',
      '5 status pages',
      '90-day history',
      '5 team members',
      'On-call scheduling',
      'SSL monitoring',
    ],
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    name: 'Pro',
    monthlyPrice: 89,
    yearlyPrice: 69,
    description: 'For scale-ups demanding enterprise reliability.',
    cta: 'Start free trial',
    ctaVariant: 'outline' as const,
    features: [
      'Unlimited monitors',
      '30-second check interval',
      'All alert channels',
      'Unlimited status pages',
      '1-year history',
      '25 team members',
      'On-call scheduling',
      'Incident management',
      'SLA reporting',
      'Custom domains',
    ],
    highlighted: false,
  },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(true);

  return (
    <section id="pricing" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-sky-400 font-medium text-sm uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            Simple, transparent pricing
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
            Start free, scale when you're ready. No hidden fees or per-alert charges.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 bg-secondary/60 border border-border rounded-full px-2 py-1.5">
            <button
              onClick={() => setYearly(false)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                !yearly ? 'bg-white text-background' : 'text-muted-foreground hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                yearly ? 'bg-white text-background' : 'text-muted-foreground hover:text-white'
              }`}
            >
              Yearly
              <span className="text-[10px] font-bold text-sky-500 bg-sky-500/15 px-1.5 py-0.5 rounded-full">
                -25%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl p-8 border transition-all duration-300 ${
                plan.highlighted
                  ? 'border-sky-500/60 bg-sky-500/5 glow'
                  : 'border-border bg-card hover:border-sky-500/30'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <Badge className="bg-sky-500 text-white border-0 px-3 py-1 text-xs font-semibold flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-white" />
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-white font-bold text-xl mb-1">{plan.name}</h3>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-extrabold text-white">
                    ${yearly ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-muted-foreground mb-2">/mo</span>
                </div>
                {yearly && plan.monthlyPrice > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Billed ${plan.yearlyPrice * 12}/year
                  </p>
                )}
              </div>

              <Link to={"/auth"}>
                <Button
                  size="lg"
                  variant={plan.ctaVariant}
                  className={`w-full mb-8 h-11 font-semibold ${
                    plan.highlighted
                      ? 'bg-sky-500 hover:bg-sky-400 text-white border-0 glow-sm'
                      : 'border-border text-white hover:border-sky-500/50'
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>

              <ul className="space-y-3 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-10">
          All paid plans include a 14-day free trial. No credit card required.
        </p>
      </div>
    </section>
  );
}
