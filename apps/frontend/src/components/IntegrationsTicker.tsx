const integrations = [
  'Slack', 'PagerDuty', 'Opsgenie', 'Microsoft Teams', 'Discord', 'Telegram',
  'Jira', 'GitHub', 'GitLab', 'Datadog', 'Grafana', 'Prometheus',
  'AWS CloudWatch', 'Google Chat', 'Zapier', 'Webhooks', 'Twilio', 'SendGrid',
];

export default function IntegrationsTicker() {
  const doubled = [...integrations, ...integrations];

  return (
    <div className="py-14 border-y border-border overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

      <p className="text-center text-xs text-muted-foreground uppercase tracking-widest mb-6">
        Integrates with your entire stack
      </p>

      <div className="flex gap-4 animate-ticker whitespace-nowrap">
        {doubled.map((name, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card text-sm text-muted-foreground shrink-0 hover:border-sky-500/40 hover:text-white transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 opacity-70" />
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
