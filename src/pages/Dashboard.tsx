import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  CreditCard, 
  FileText, 
  ArrowRight, 
  Calendar,
  DollarSign,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { UploadHistory } from '@/hooks/useAuth';

const SUBSCRIPTION_LABELS: Record<string, { label: string; color: string }> = {
  free: { label: 'Free', color: 'bg-muted text-muted-foreground' },
  pro: { label: 'Pro', color: 'bg-primary text-primary-foreground' },
  agency: { label: 'Agency', color: 'bg-secondary text-secondary-foreground' },
};

export default function Dashboard() {
  const { user, profile } = useAuthContext();
  const [uploads, setUploads] = useState<UploadHistory[]>([]);
  const [loadingUploads, setLoadingUploads] = useState(true);
  const [loadingPortal, setLoadingPortal] = useState(false);

  const handleManageSubscription = async () => {
    if (!profile?.stripe_customer_id) {
      console.error('No Stripe customer ID found');
      return;
    }
    
    setLoadingPortal(true);
    try {
      const response = await fetch(
        `https://takeoff-api-uyzv.onrender.com/api/v1/create-portal-session?customer_id=${profile.stripe_customer_id}&return_url=${encodeURIComponent(window.location.href)}`,
        { method: 'POST' }
      );
      const data = await response.json();
      if (data.portal_url) {
        window.location.href = data.portal_url;
      } else {
        console.error('No portal URL returned');
      }
    } catch (error) {
      console.error('Error opening portal:', error);
    } finally {
      setLoadingPortal(false);
    }
  };

  useEffect(() => {
    async function fetchUploads() {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('upload_history')
        .select('*')
        .eq('user_id', user.id)
        .order('upload_date', { ascending: false })
        .limit(10);

      if (!error && data) {
        setUploads(data as UploadHistory[]);
      }
      setLoadingUploads(false);
    }

    fetchUploads();
  }, [user]);

  const subscription = profile?.subscription_status || 'free';
  const subscriptionInfo = SUBSCRIPTION_LABELS[subscription] || SUBSCRIPTION_LABELS.free;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '—';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your account and view your analysis history
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Account Info Card */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                  <User className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Account</h2>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground">Email</label>
                  <p className="text-foreground font-medium">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Member since</label>
                  <p className="text-foreground font-medium">
                    {user?.created_at ? formatDate(user.created_at) : '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* Subscription Card */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Subscription</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className={subscriptionInfo.color}>
                    {subscriptionInfo.label}
                  </Badge>
                  {subscription === 'free' && (
                    <span className="text-sm text-muted-foreground">
                      3 estimates/month
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {subscription === 'free' ? (
                    <Link to="/pricing">
                      <Button size="sm" className="gap-1">
                        Upgrade
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="gap-1"
                      onClick={handleManageSubscription}
                      disabled={loadingPortal}
                    >
                      {loadingPortal ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <>
                          Manage Subscription
                          <ExternalLink className="w-3 h-3" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Upload History */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                  <FileText className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Upload History</h2>
              </div>
              <Link to="/analyze">
                <Button size="sm" className="gap-1">
                  New Analysis
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>

            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
              {loadingUploads ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : uploads.length === 0 ? (
                <div className="text-center py-12 px-6">
                  <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No analyses yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Upload your first blueprint to get started
                  </p>
                  <Link to="/analyze">
                    <Button>
                      Analyze Blueprint
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {uploads.map((upload) => (
                    <div
                      key={upload.id}
                      className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {upload.filename}
                          </p>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(upload.upload_date)}
                            </span>
                            {upload.room_count && (
                              <span>{upload.room_count} rooms</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-semibold text-foreground flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {formatCurrency(upload.total_estimate)}
                        </p>
                        {upload.total_area && (
                          <p className="text-sm text-muted-foreground">
                            {upload.total_area.toLocaleString()} sq ft
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
