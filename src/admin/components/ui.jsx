import { Component } from "react";
import { Loader2 } from "lucide-react";
import { navigate } from "../router";

const buttonVariants = {
  primary: "border-accent bg-accent text-canvas hover:bg-ink hover:border-ink",
  secondary: "border-line bg-transparent text-ink hover:border-stone/60",
  ghost: "border-transparent bg-transparent text-stone hover:text-ink hover:bg-elevated",
  danger: "border-danger/60 bg-transparent text-danger hover:bg-danger hover:text-canvas hover:border-danger",
};

const buttonSizes = {
  md: "h-9 px-3.5 text-sm gap-2",
  sm: "h-8 px-2.5 text-xs gap-1.5",
  icon: "size-8 justify-center",
};

export function Button({ variant = "secondary", size = "md", icon: Icon, loading = false, className = "", children, disabled, ...props }) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={`inline-flex shrink-0 cursor-pointer items-center border font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`}
      {...props}
    >
      {loading ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : Icon && <Icon aria-hidden="true" className="size-4" />}
      {children}
    </button>
  );
}

// In-app link: client-side navigation for plain left clicks, normal <a> otherwise.
export function Link({ to, onClick, children, ...props }) {
  return (
    <a
      href={to}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || props.target) return;
        event.preventDefault();
        navigate(to);
      }}
      {...props}
    >
      {children}
    </a>
  );
}

export function Skeleton({ className = "" }) {
  return <div aria-hidden="true" className={`animate-pulse bg-elevated ${className}`} />;
}

export function EmptyState({ icon: Icon, title, children, action }) {
  return (
    <div className="flex flex-col items-start gap-3 border border-dashed border-line px-6 py-10">
      {Icon && <Icon aria-hidden="true" className="size-5 text-stone" />}
      <p className="text-base font-medium text-ink">{title}</p>
      {children && <p className="max-w-[60ch] text-sm leading-relaxed text-stone">{children}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

// olive (status) is below 4.5:1 for small text, so it only colours the dot
const badgeTones = {
  published: { text: "text-ink", dot: "bg-status" },
  draft: { text: "text-accent", dot: "bg-accent" },
  hidden: { text: "text-stone", dot: "border border-stone" },
};

export function StatusBadge({ tone, children }) {
  return (
    <span className={`inline-flex shrink-0 items-center gap-2 text-xs ${badgeTones[tone].text}`}>
      <span aria-hidden="true" className={`size-1.5 rounded-full ${badgeTones[tone].dot}`} />
      {children}
    </span>
  );
}

export function PageHeader({ title, description, actions }) {
  return (
    <header className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.01em] text-ink">{title}</h1>
        {description && <p className="mt-1.5 max-w-[65ch] text-sm leading-relaxed text-stone">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export function Section({ title, description, children }) {
  return (
    <section className="grid gap-6 border-b border-line py-8 last:border-b-0 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:gap-12">
      <div>
        <h2 className="text-base font-medium text-ink">{title}</h2>
        {description && <p className="mt-1.5 text-sm leading-relaxed text-stone">{description}</p>}
      </div>
      <div className="min-w-0 space-y-6">{children}</div>
    </section>
  );
}

export class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidUpdate(prevProps) {
    // a new route gets a fresh chance
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null });
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div role="alert" className="border border-danger/50 px-6 py-6">
        <p className="text-base font-medium text-ink">This page couldn&apos;t load</p>
        <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-stone">
          {this.state.error.message || "Something went wrong talking to Sanity."} If you just signed in, make sure your account is a member of the Sanity project.
        </p>
        <Button className="mt-4" onClick={() => this.setState({ error: null })}>
          Try again
        </Button>
      </div>
    );
  }
}
