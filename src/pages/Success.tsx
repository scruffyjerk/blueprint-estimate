import { CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

export default function Success() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Welcome to Pro!
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            Your subscription is active. You now have access to unlimited estimates and all Pro features.
          </p>

          <div className="space-y-4">
            <Button asChild size="lg" className="w-full">
              <Link to="/analyze">
                Start Analyzing Blueprints
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link to="/">
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
