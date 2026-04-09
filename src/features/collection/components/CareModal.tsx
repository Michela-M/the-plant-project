import ComboBox from '@components/ComboBox';
import type { ComboBoxOption } from '@components/ComboBox/types';
import Modal from '@components/Modal';
import RadioGroup, { RadioButton } from '@components/Radio';
import Spinner from '@components/Spinner';
import TextField from '@components/TextField';
import { useAuth } from '@context/auth/useAuth';
import { useToast } from '@context/toast/useToast';
import { addCareEntry } from '@features/collection/services/addCareEntry';
import combineDateWithCurrentTime from '@utils/combineDateWithCurrentTime';
import getLocalDateInputValue from '@utils/getLocalDateInputValue';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useAllPlants from '../hooks/useAllPlants';
import updateWateringDates from '../utils/updateWateringDates';

export default function CareModal({
  setShowCareModal,
  plantId,
}: Readonly<{
  setShowCareModal: (show: boolean) => void;
  plantId?: string;
}>) {
  const { plants, loading } = useAllPlants(plantId);
  const { showError, showSuccess } = useToast();
  const { user } = useAuth();
  const comboBoxOptions: ComboBoxOption[] = plants.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.speciesName,
    imageUrl: p.imageUrl,
  }));

  const addCareValidationSchema = Yup.object().shape({
    date: Yup.date()
      .typeError('Must be a valid date')
      .max(new Date(), 'Date cannot be in the future'),
    careType: Yup.string().required('Care type is required'),
    otherCareType: Yup.string().when('careType', {
      is: 'other',
      then: (schema) =>
        schema
          .required('Please specify the care type')
          .min(3, 'Care type must be at least 3 characters'),
      otherwise: (schema) => schema.notRequired(),
    }),
    plant: plantId
      ? Yup.string().notRequired()
      : Yup.string().required('Please select a plant'),
    notes: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      date: getLocalDateInputValue(new Date()),
      careType: 'water',
      otherCareType: '',
      plant: '',
      notes: '',
    },
    validationSchema: addCareValidationSchema,
    onSubmit: async (values) => {
      try {
        const careDate = combineDateWithCurrentTime(values.date);
        const selectedPlantId =
          plantId ?? plants.find((plant) => plant.name === values.plant)?.id;
        if (!selectedPlantId) {
          showError('Please select a plant');
          return;
        }

        const wateringUpdateData =
          values.careType === 'water'
            ? await updateWateringDates(selectedPlantId, user?.id || '', {
                date: careDate,
              })
            : {};

        await addCareEntry({
          date: careDate,
          careType: values.careType,
          notes: values.notes,
          otherCareType: values.otherCareType,
          plantId: selectedPlantId,
          userId: user?.id || '',
          ...wateringUpdateData,
        });
        setShowCareModal(false);
        showSuccess('Care entry added successfully');
      } catch (error) {
        showError(
          'Error adding care entry',
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    },
  });

  return (
    <Modal
      title="New care entry"
      onClose={() => setShowCareModal(false)}
      type="transactional"
      label="Create"
      onConfirm={formik.handleSubmit}
    >
      {loading ? (
        <Spinner label="Loading plants..." />
      ) : (
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
          {!plantId && (
            <ComboBox
              label="Select plant"
              placeholder="Select plant"
              options={comboBoxOptions}
              value={formik.values.plant}
              onBlur={() => formik.setFieldTouched('plant', true)}
              onSelectionChange={(selection) => {
                formik.setFieldValue('plant', selection.name);
                formik.setFieldTouched('plant', true);
              }}
              readOnly
            />
          )}
          <RadioGroup label="Care type" layout="horizontal">
            <RadioButton
              label="Water"
              value="water"
              checked={formik.values.careType === 'water'}
              onChange={() => formik.setFieldValue('careType', 'water')}
            />
            <RadioButton
              label="Fertilize"
              value="fertilize"
              checked={formik.values.careType === 'fertilize'}
              onChange={() => formik.setFieldValue('careType', 'fertilize')}
            />
            <RadioButton
              label="Repot"
              value="repot"
              checked={formik.values.careType === 'repot'}
              onChange={() => formik.setFieldValue('careType', 'repot')}
            />
            <RadioButton
              label="Other"
              value="other"
              checked={formik.values.careType === 'other'}
              onChange={() => formik.setFieldValue('careType', 'other')}
            />
          </RadioGroup>
          {formik.values.careType === 'other' && (
            <TextField
              placeholder="Other care"
              type="text"
              name="otherCareType"
              value={formik.values.otherCareType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.otherCareType
                  ? formik.errors.otherCareType
                  : undefined
              }
              ariaLabel="Other care type"
            />
          )}
          <TextField
            label="Notes"
            type="textarea"
            name="notes"
            value={formik.values.notes}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.notes ? formik.errors.notes : undefined}
          />
        </div>
      )}
    </Modal>
  );
}
