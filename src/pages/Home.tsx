import { Link } from 'react-router-dom';
import { ArrowRight, Upload, Cpu, FileSpreadsheet, CheckCircle, Zap, Target } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const STEPS = [
  {
    icon: Upload,
    title: 'Upload Blueprint',
    description: 'Drag and drop your floor plan image — PNG, JPG, or WEBP.',
  },
  {
    icon: Cpu,
    title: 'AI Analyzes',
    description: 'Our AI detects rooms, dimensions, and calculates square footage.',
  },
  {
    icon: FileSpreadsheet,
    title: 'Get Estimates',
    description: 'Receive detailed material quantities and cost breakdowns instantly.',
  },
];

const FEATURES = [
  {
    icon: Zap,
    title: 'Powered by GPT-4 Vision',
    description: 'State-of-the-art AI ensures accurate room detection and measurements.',
  },
  {
    icon: Target,
    title: '~10% Accuracy',
    description: 'Results comparable to manual takeoffs, delivered in seconds.',
  },
  {
    icon: CheckCircle,
    title: 'No Account Needed',
    description: 'Upload and analyze immediately. No signup required.',
  },
];

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-gradient py-16 md:py-24 lg:py-32">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Get Accurate Construction Estimates{' '}
              <span className="text-gradient">in Seconds</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Upload your floor plan. Our AI extracts room dimensions and calculates material costs instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/analyze">
                <Button size="lg" className="w-full sm:w-auto gap-2 text-base">
                  Analyze My Blueprint
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base">
                  See How It Works
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Three simple steps to transform your blueprint into a detailed cost estimate.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {STEPS.map((step, index) => (
              <div key={index} className="relative text-center group">
                {index < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-border" />
                )}
                <div className="relative inline-block mb-4">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-md">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 md:py-24 bg-surface">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {FEATURES.map((feature, index) => (
              <div key={index} className="card-elevated p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Testimonial Placeholder */}
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="card-elevated p-6 md:p-8 text-center">
              <p className="text-lg text-foreground italic mb-4">
                "Takeoff.ai cut my estimating time from hours to minutes. The accuracy is impressive for an AI tool."
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-sm font-medium text-muted-foreground">JD</span>
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground text-sm">John D.</p>
                  <p className="text-xs text-muted-foreground">General Contractor, Denver</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to speed up your estimates?
            </h2>
            <p className="text-muted-foreground mb-8">
              No signup required. Upload a blueprint and see results in under a minute.
            </p>
            <Link to="/analyze">
              <Button size="lg" className="gap-2">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
