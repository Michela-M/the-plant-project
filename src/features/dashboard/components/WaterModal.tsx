import Modal from '@components/Modal';
import TextField from '@components/TextField';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import getLocalDateInputValue from '@utils/getLocalDateInputValue';
import combineDateWithCurrentTime from '@utils/combineDateWithCurrentTime';
import { addCareEntry } from '@features/collection/services/addCareEntry';
import { useAuth } from '@context/auth/useAuth';
import { useToast } from '@context/toast/useToast';

const waterValidationSchema = {
  date: Yup.date()
    .typeError('Must be a valid date')
    .max(new Date(), 'Date cannot be in the future'),
  notes: Yup.string(),
};

export default function WaterModal({
  plantId,
  setShowWaterModal,
}: {
  plantId: string;
  setShowWaterModal: (value: boolean) => void;
}) {
  const { user } = useAuth();
  const { showError, showSuccess } = useToast();

  const formik = useFormik({
    initialValues: {
      date: getLocalDateInputValue(new Date()),
      notes: '',
    },
    validationSchema: Yup.object(waterValidationSchema),
    onSubmit: async (values) => {
      if (!user || !user.id) {
        showError(
          'Error watering plant',
          'You must be logged in to add a care entry.'
        );
        return;
      }
      try {
        const careDate = combineDateWithCurrentTime(values.date);

        await addCareEntry({
          plantId,
          userId: user.id,
          careType: 'water',
          date: careDate,
          notes: values.notes,
        });
        setShowWaterModal(false);
        showSuccess('Plant watered', 'Care entry added successfully');
      } catch (error) {
        showError(
          'Error watering plant',
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    },
  });

  return (
    <Modal
      title="Water Plant"
      onClose={() => setShowWaterModal(false)}
      type="transactional"
      onConfirm={formik.handleSubmit}
    >
      <div className="flex flex-col gap-4">
        <TextField
          name="date"
          label="Date"
          type="date"
          value={formik.values.date}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.date ? formik.errors.date : undefined}
        />
        <TextField
          name="notes"
          label="Notes"
          type="textarea"
          value={formik.values.notes}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.notes ? formik.errors.notes : undefined}
        />
      </div>
    </Modal>
  );
}
