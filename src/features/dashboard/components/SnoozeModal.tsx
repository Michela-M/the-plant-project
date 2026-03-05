import Modal from '@components/Modal';
import RadioGroup, { RadioButton } from '@components/Radio';
import { useFormik } from 'formik';
import { updateNextWatering } from '../services/updateNextWateringDate';
import { useAuth } from '@context/auth/useAuth';
import { useToast } from '@context/toast/useToast';

export default function SnoozeModal({
  plantId,
  setShowSnoozeModal,
}: {
  plantId: string;
  setShowSnoozeModal: (value: boolean) => void;
}) {
  const { user } = useAuth();
  const { showError, showSuccess } = useToast();

  const formik = useFormik({
    initialValues: {
      snoozeOption: '1',
      snoozeDays: '2',
    },
    onSubmit: (values) => {
      // Calculate the new next watering date based on the selected snooze option
      const currentDate = new Date();
      let nextWateringDate: Date | null = null;

      if (values.snoozeOption === '1') {
        nextWateringDate = new Date(currentDate);
        nextWateringDate.setDate(currentDate.getDate() + 1);
      } else if (values.snoozeOption === '2') {
        const daysToSnooze = parseInt(values.snoozeDays, 10);
        if (!isNaN(daysToSnooze) && daysToSnooze > 0) {
          nextWateringDate = new Date(currentDate);
          nextWateringDate.setDate(currentDate.getDate() + daysToSnooze);
        }
      }

      console.log('Calculated next watering date:', nextWateringDate);

      if (!user) {
        setShowSnoozeModal(false);
        showError('User not authenticated. Please log in again.');
        return;
      }

      updateNextWatering(plantId, user.id, nextWateringDate);

      setShowSnoozeModal(false);
      showSuccess('Watering reminder snoozed successfully!');
    },
  });

  return (
    <Modal
      title="No need to water today!"
      onClose={() => setShowSnoozeModal(false)}
      type="transactional"
      onConfirm={formik.handleSubmit}
    >
      <RadioGroup label="Remind me in">
        <RadioButton
          label="Remind me tomorrow"
          value="1"
          checked={formik.values.snoozeOption === '1'}
          onChange={() => formik.setFieldValue('snoozeOption', '1')}
        />
        <RadioButton
          label={
            <span className="inline-flex items-center gap-2">
              Remind me in
              <input
                type="number"
                min="1"
                step="1"
                value={formik.values.snoozeDays}
                onFocus={() => formik.setFieldValue('snoozeOption', '2')}
                onChange={(event) => {
                  formik.setFieldValue('snoozeOption', '2');
                  formik.setFieldValue('snoozeDays', event.target.value);
                }}
                className="w-16 px-2 py-1 rounded border border-stone-300 focus:outline-green-800 focus:outline-2 focus:outline-offset-1"
                aria-label="Number of days"
              />
              days
            </span>
          }
          value="2"
          checked={formik.values.snoozeOption === '2'}
          onChange={() => formik.setFieldValue('snoozeOption', '2')}
        />
        <RadioButton
          label="Don't remind me"
          value="3"
          checked={formik.values.snoozeOption === '3'}
          onChange={() => formik.setFieldValue('snoozeOption', '3')}
        />
      </RadioGroup>
    </Modal>
  );
}
