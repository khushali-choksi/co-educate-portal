import Icon from '@/components/ui/AppIcon';

interface ClientInformationProps {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
}

const ClientInformation = ({
  clientName,
  clientEmail,
  clientPhone,
  clientAddress,
}: ClientInformationProps) => {
  return (
    <div className="bg-card rounded-lg border border-border p-6 clinical-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-primary/10">
          <Icon name="UserIcon" size={20} variant="solid" className="text-brand-primary" />
        </div>
        <h2 className="text-lg font-heading font-semibold text-text-primary">
          Client Information
        </h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted">
            <Icon name="UserCircleIcon" size={16} variant="outline" className="text-text-secondary" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-text-secondary mb-1">Full Name</p>
            <p className="text-sm font-medium text-text-primary">{clientName}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted">
            <Icon name="EnvelopeIcon" size={16} variant="outline" className="text-text-secondary" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-text-secondary mb-1">Email Address</p>
            <p className={`text-sm font-medium break-all ${clientEmail ? 'text-text-primary' : 'text-text-secondary italic'}`}>
              {clientEmail || 'Not provided'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted">
            <Icon name="PhoneIcon" size={16} variant="outline" className="text-text-secondary" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-text-secondary mb-1">Phone Number</p>
            <p className="text-sm font-medium text-text-primary">{clientPhone}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted">
            <Icon name="MapPinIcon" size={16} variant="outline" className="text-text-secondary" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-text-secondary mb-1">Address</p>
            <p className="text-sm font-medium text-text-primary">{clientAddress}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientInformation;