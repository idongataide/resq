import React from 'react';
import { Modal } from 'antd';
import EditCompanyDetails from './editCompanyDetails';
import EditAccountDetails from './editAccountDetails';
import EditContactDetailsStep from './editContactDetailsStep';
import ConfirmOperator from '@/pages/dashboard/screens/operations/2FA';
import { updateOperator } from '@/api/operatorsApi';
import toast from 'react-hot-toast';

interface EditCompanyProfileProps {
  isOpen: boolean;
  onClose: () => void;
  operatorData: any;
  onSuccess: () => void;
}

const EditCompanyProfile: React.FC<EditCompanyProfileProps> = ({
  isOpen,
  onClose,
  operatorData,
  onSuccess
}) => {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [formData, setFormData] = React.useState<any>({});
  const [show2FA, setShow2FA] = React.useState(false);

  const handleStepComplete = (data: any) => {
    setFormData((prev: Record<string, any>) => ({ ...prev, ...data }));
    
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShow2FA(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      onClose();
    }
  };

  const handle2FAComplete = async (otp: string) => {
    try {
      const payload = {
        ...formData,
        otp
      };

      const response = await updateOperator(operatorData.id, payload);
      
      if (response?.status === 'ok') {
        toast.success('Operator profile updated successfully');
        onSuccess();
        onClose();
      } else {
        toast.error(response?.response?.data?.msg || 'Failed to update operator profile');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while updating operator profile');
    } finally {
      setShow2FA(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <EditCompanyDetails
            onBack={handleBack}
            onNext={handleStepComplete}
            initialData={operatorData}
          />
        );
      case 2:
        return (
          <EditAccountDetails
            onBack={handleBack}
            onNext={handleStepComplete}
            initialData={operatorData}
          />
        );
      case 3:
        return (
          <EditContactDetailsStep
            onBack={handleBack}
            onNext={handleStepComplete}
            initialData={operatorData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Modal
        open={isOpen}
        onCancel={onClose}
        footer={null}
        width={600}
        centered
        destroyOnClose
      >
        {renderStep()}
      </Modal>

      {show2FA && (
        <ConfirmOperator
          onClose={() => setShow2FA(false)}
          onSuccess={handle2FAComplete}
        />
      )}
    </>
  );
};

export default EditCompanyProfile; 