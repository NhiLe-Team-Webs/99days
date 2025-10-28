import { useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { useToast } from '@/hooks/use-toast';
import { checkEmailExists, submitApplication, type ApplicantFormInput } from '@/lib/api';

type FormKey = keyof ApplicantFormInput;

const defaultFormData: ApplicantFormInput = {
  ho_ten: '',
  email: '',
  telegram: '',
  nam_sinh: '',
  gioi_tinh: '',
  dia_chi: '',
  da_tham_gia_truoc: '',
  link_bai_chia_se: '',
  muc_tieu: '',
  ky_luat_rating: '',
  ly_do: '',
  thoi_gian_thuc_day: '',
  tan_suat_tap_the_duc: '',
  muc_do_van_dong: '',
  tinh_trang_suc_khoe: '',
  dong_y: false
};

const STEP_CONFIG: {
  id: string;
  title: string;
  description?: string;
  fields: FormKey[];
}[] = [
  {
    id: 'personal',
    title: 'THÔNG TIN CÁ NHÂN',
    fields: ['ho_ten', 'nam_sinh', 'gioi_tinh', 'dia_chi']
  },
  {
    id: 'contact',
    title: 'KÊNH LIÊN LẠC',
    fields: ['email', 'telegram']
  },
  {
    id: 'experience',
    title: 'TRẢI NGHIỆM TRƯỚC ĐÂY',
    fields: ['da_tham_gia_truoc', 'link_bai_chia_se', 'muc_tieu']
  },
  {
    id: 'discipline',
    title: 'KỶ LUẬT & ĐỘNG LỰC',
    fields: ['ky_luat_rating', 'ly_do', 'thoi_gian_thuc_day']
  },
  {
    id: 'habits',
    title: 'THÓI QUEN VẬN ĐỘNG',
    fields: ['tan_suat_tap_the_duc', 'muc_do_van_dong']
  },
  {
    id: 'health',
    title: 'TÌNH TRẠNG SỨC KHỎE',
    fields: ['tinh_trang_suc_khoe', 'dong_y']
  }
];

const fieldLabels: Record<FormKey, string> = {
  ho_ten: 'Họ và tên',
  email: 'Email',
  telegram: 'Username Telegram',
  nam_sinh: 'Năm sinh',
  gioi_tinh: 'Giới tính',
  dia_chi: 'Địa chỉ đang sinh sống',
  da_tham_gia_truoc: 'Bạn đã tham gia các mùa trước chưa',
  link_bai_chia_se: 'Link bài chia sẻ',
  muc_tieu: 'Mục tiêu sau 99 ngày',
  ky_luat_rating: 'Mức độ kỷ luật hiện tại',
  ly_do: 'Vì sao bạn tham gia chương trình này',
  thoi_gian_thuc_day: 'Bạn thường dậy lúc mấy giờ',
  tan_suat_tap_the_duc: 'Tần suất tập luyện 3 tháng qua',
  muc_do_van_dong: 'Mức độ vận động mỗi ngày',
  tinh_trang_suc_khoe: 'Tình trạng sức khỏe cần lưu ý',
  dong_y: 'Tôi đồng ý với các điều khoản của chương trình'
};

type ErrorState = Partial<Record<FormKey, string>>;

const participationOptions = [
  { value: 'Chưa', label: 'Chưa' },
  { value: 'Rồi', label: 'Rồi' }
];

const wakeupOptions = [
  { value: 'Trước 5:00', label: 'Trước 5:00' },
  { value: '5:00 - 6:00', label: '5:00 - 6:00' },
  { value: '6:00 - 7:00', label: '6:00 - 7:00' },
  { value: 'Sau 7:00', label: 'Sau 7:00' }
];

const workoutFrequencyOptions = [
  { value: '0-1 buổi/tuần', label: 'Hầu như không tập (0-1 buổi/tuần)' },
  { value: '2-3 buổi/tuần', label: 'Không đều (2-3 buổi/tuần)' },
  { value: '4-5 buổi/tuần', label: 'Đều đặn (4-5 buổi/tuần)' },
  { value: 'Trên 5 buổi/tuần', label: 'Rất thường xuyên (>5 buổi/tuần)' }
];

const genderOptions = [
  { value: 'Nữ', label: 'Nữ' },
  { value: 'Nam', label: 'Nam' },
  { value: 'Khác', label: 'Khác' }
];

const disciplineScale = ['1', '2', '3', '4', '5'];

const activityScale = ['1', '2', '3', '4', '5'];

const RegistrationSection = () => {
  const [formData, setFormData] = useState(defaultFormData);
  const [errors, setErrors] = useState<ErrorState>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [touchedFields, setTouchedFields] = useState<Set<FormKey>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [status, setStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
  const isReturningParticipant = formData.da_tham_gia_truoc === 'Rồi';
  const cardRef = useRef<HTMLDivElement | null>(null);

  const totalSteps = STEP_CONFIG.length;
  const activeStep = STEP_CONFIG[currentStep];
  const progressPercent = ((currentStep + 1) / totalSteps) * 100;
  const EXPERIENCE_STEP_INDEX = STEP_CONFIG.findIndex((step) => step.id === 'experience');
  const isExperienceStep = currentStep === EXPERIENCE_STEP_INDEX;
  const linkValue =
    typeof formData.link_bai_chia_se === 'string' ? formData.link_bai_chia_se.trim() : '';
  const isLinkMissing = isReturningParticipant && linkValue === '';
  const baseButtonDisabled = isSubmitting || isCheckingEmail;
  const nextStepDisabled = baseButtonDisabled || (isExperienceStep && isLinkMissing);
  const submitDisabled = baseButtonDisabled || (isReturningParticipant && linkValue === '');
  const getFieldError = (field: FormKey, override?: string | null) => {
    if (!touchedFields.has(field)) {
      return null;
    }
    return override ?? errors[field] ?? null;
  };

  const linkErrorMessage = getFieldError(
    'link_bai_chia_se',
    isReturningParticipant && isLinkMissing ? 'Vui lòng nhập link bài chia sẻ' : null
  );
  const fieldErrors = {
    ho_ten: getFieldError('ho_ten'),
    nam_sinh: getFieldError('nam_sinh'),
    gioi_tinh: getFieldError('gioi_tinh'),
    dia_chi: getFieldError('dia_chi'),
    email: getFieldError('email'),
    telegram: getFieldError('telegram'),
    da_tham_gia_truoc: getFieldError('da_tham_gia_truoc'),
    muc_tieu: getFieldError('muc_tieu'),
    ky_luat_rating: getFieldError('ky_luat_rating'),
    ly_do: getFieldError('ly_do'),
    thoi_gian_thuc_day: getFieldError('thoi_gian_thuc_day'),
    tan_suat_tap_the_duc: getFieldError('tan_suat_tap_the_duc'),
    muc_do_van_dong: getFieldError('muc_do_van_dong'),
    tinh_trang_suc_khoe: getFieldError('tinh_trang_suc_khoe'),
    dong_y: getFieldError('dong_y')
  };

  const resetForm = () => {
    setFormData(defaultFormData);
    setErrors({});
    setCurrentStep(0);
    setTouchedFields(new Set());
    requestAnimationFrame(() => {
      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const validateFields = (fields: FormKey[]) => {
    const newErrors: ErrorState = {};
    const trimmed = (value: unknown) => (typeof value === 'string' ? value.trim() : value);
    const currentYear = new Date().getFullYear();

    fields.forEach((field) => {
      const value = formData[field];
      switch (field) {
        case 'nam_sinh': {
          const raw = trimmed(value);
          const asNumber = Number(raw);
          if (!raw) {
            newErrors[field] = `${fieldLabels[field]} là bắt buộc`;
          } else if (!Number.isInteger(asNumber) || asNumber < 1900 || asNumber > currentYear) {
            newErrors[field] = 'Năm sinh không hợp lệ';
          }
          break;
        }
        case 'ky_luat_rating': {
          const rating = Number(value);
          if (!rating || rating < 1 || rating > 5) {
            newErrors[field] = 'Vui lòng chọn mức đánh giá từ 1 đến 5';
          }
          break;
        }
        case 'muc_do_van_dong': {
          const level = Number(value);
          if (!level || level < 1 || level > 5) {
            newErrors[field] = 'Vui lòng đánh giá mức độ vận động từ 1 đến 5';
          }
          break;
        }
        case 'dong_y': {
          if (!formData.dong_y) {
            newErrors[field] = 'Bạn cần đồng ý trước khi gửi đăng ký';
          }
          break;
        }
        default: {
          if (typeof value === 'string' && value.trim() === '' && field !== 'link_bai_chia_se') {
            newErrors[field] = `${fieldLabels[field]} là bắt buộc`;
          }
          break;
        }
      }
    });

    setErrors((prev) => {
      const cleared = { ...prev };
      fields.forEach((field) => {
        delete cleared[field];
      });
      return { ...cleared, ...newErrors };
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, type } = e.target;
    const fieldName = name as FormKey;
    const value =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : (e.target as HTMLInputElement).value;

    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
      ...(fieldName === 'da_tham_gia_truoc' && value === 'Chưa' ? { link_bai_chia_se: '' } : {})
    }));

    if (errors[fieldName]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[fieldName];
        return updated;
      });
    }

    if (fieldName === 'da_tham_gia_truoc' && value === 'Chưa' && errors.link_bai_chia_se) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated.link_bai_chia_se;
        return updated;
      });
    }
  };

  const markFieldTouched = (field: FormKey) => {
    setTouchedFields((prev) => {
      const next = new Set(prev);
      next.add(field);
      return next;
    });
  };

  const markFieldsTouched = (fields: FormKey[]) => {
    setTouchedFields((prev) => {
      const next = new Set(prev);
      fields.forEach((field) => next.add(field));
      return next;
    });
  };

  const handleNext = () => {
    if (isExperienceStep && isLinkMissing) {
      setErrors((prev) => ({
        ...prev,
        link_bai_chia_se: 'Vui lòng nhập link bài chia sẻ'
      }));
      markFieldsTouched(activeStep.fields);
      return;
    }

    if (!validateFields(activeStep.fields)) {
      markFieldsTouched(activeStep.fields);
      return;
    }

    markFieldsTouched(activeStep.fields);
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
    requestAnimationFrame(() => {
      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    requestAnimationFrame(() => {
      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isExperienceStep && isLinkMissing) {
      setErrors((prev) => ({
        ...prev,
        link_bai_chia_se: 'Vui lòng nhập link bài chia sẻ'
      }));
      markFieldsTouched(activeStep.fields);
      return;
    }

    if (!validateFields(activeStep.fields)) {
      markFieldsTouched(activeStep.fields);
      return;
    }

    setStatus('checking');
    setErrorMessage(null);
    setIsCheckingEmail(true);

    try {
      const exists = await checkEmailExists(formData.email);
      if (exists) {
        setErrorMessage('Email này đã được đăng ký trước đó.');
        setStatus('error');
        setIsCheckingEmail(false);
        setErrors((prev) => ({ ...prev, email: 'Email này đã tồn tại trong hệ thống' }));
        markFieldTouched('email');
        return;
      }
  } catch (error) {
    setErrorMessage('Không thể kiểm tra email. Vui lòng thử lại sau.');
      setStatus('error');
      setIsCheckingEmail(false);
      return;
    }

    setIsCheckingEmail(false);
    setIsSubmitting(true);

    try {
      await submitApplication(formData);
      setStatus('success');
      toast({
        title: 'Đăng ký thành công',
        description: 'Vui lòng kiểm tra email để nhận hướng dẫn tiếp theo.'
      });
      resetForm();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Đăng ký thất bại. Vui lòng thử lại sau.';
      setErrorMessage(message);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StepIndicator = useMemo(
    () => (
      <ol className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {STEP_CONFIG.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const statusClass = isActive
            ? 'border-primary bg-primary text-white'
            : isCompleted
            ? 'border-primary bg-primary/10 text-primary'
            : 'border-primary/40 bg-transparent text-primary/70';

          return (
            <li key={step.id} className="flex flex-col items-start gap-2">
              <span
                className={`inline-flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors ${statusClass}`}
              >
                {index + 1}
              </span>
              <div className="space-y-1">
                <p
                  className={`text-sm font-semibold uppercase tracking-wide ${
                    isActive ? 'text-primary' : 'text-primary/80'
                  }`}
                >
                  {step.title}
                </p>
                {step.description ? (
                  <p className="text-xs text-primary/70">{step.description}</p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    ),
    [currentStep]
  );

  const renderDisciplineScale = () => (
    <div className="space-y-4">
      <div className="flex justify-between text-xs text-gray-500">
        <span>1 (không kỷ luật)</span>
        <span>5 (rất kỷ luật)</span>
      </div>
      <div className="grid grid-cols-5 gap-3">
        {disciplineScale.map((value) => (
          <label
            key={value}
            className={`flex flex-col items-center rounded-lg border p-3 text-sm font-medium transition ${
              formData.ky_luat_rating === value
                ? 'border-primary bg-primary text-white'
                : 'border-gray-300 bg-white text-gray-700 hover:border-primary hover:text-primary'
            }`}
          >
            <input
              type="radio"
              name="ky_luat_rating"
              value={value}
              checked={formData.ky_luat_rating === value}
              onChange={handleInputChange}
              className="sr-only"
            />
            {value}
          </label>
        ))}
      </div>
      {fieldErrors.ky_luat_rating && <p className="text-sm text-red-600">{fieldErrors.ky_luat_rating}</p>}
    </div>
  );

  const renderActivityScale = () => (
    <div className="space-y-4">
      <div className="flex justify-between text-xs text-gray-500">
        <span>Rất ít</span>
        <span>Rất nhiều</span>
      </div>
      <div className="grid grid-cols-5 gap-3">
        {activityScale.map((value) => (
          <label
            key={value}
            className={`flex flex-col items-center rounded-lg border p-3 text-sm font-medium transition ${
              formData.muc_do_van_dong === value
                ? 'border-primary bg-primary text-white'
                : 'border-gray-300 bg-white text-gray-700 hover:border-primary hover:text-primary'
            }`}
          >
            <input
              type="radio"
              name="muc_do_van_dong"
              value={value}
              checked={formData.muc_do_van_dong === value}
              onChange={handleInputChange}
              className="sr-only"
            />
            {value}
          </label>
        ))}
      </div>
      <p className="text-xs text-gray-500">
        1: hầu như chỉ ngồi làm việc. 5: tập thể dục mỗi ngày hoặc lao động thể chất nhiều.
      </p>
      {fieldErrors.muc_do_van_dong && <p className="text-sm text-red-600">{fieldErrors.muc_do_van_dong}</p>}
    </div>
  );

  const renderStepContent = () => {
    switch (activeStep.id) {
      case 'personal':
        return (
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="ho_ten">
                Ho va Ten *
              </label>
              <input
                id="ho_ten"
                name="ho_ten"
                value={formData.ho_ten}
                onChange={handleInputChange}
                className="form-input"
                required
              />
              {fieldErrors.ho_ten && <p className="mt-1 text-sm text-red-600">{fieldErrors.ho_ten}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="nam_sinh">
                Năm sinh *
              </label>
              <input
                id="nam_sinh"
                name="nam_sinh"
                type="number"
                inputMode="numeric"
                value={formData.nam_sinh}
                onChange={handleInputChange}
                className="form-input"
                required
              />
              {fieldErrors.nam_sinh && <p className="mt-1 text-sm text-red-600">{fieldErrors.nam_sinh}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="gioi_tinh">
                Giới tính *
              </label>
              <select
                id="gioi_tinh"
                name="gioi_tinh"
                value={formData.gioi_tinh}
                onChange={handleInputChange}
                className="form-input"
                required
              >
                <option value="">Chọn giới tính</option>
                {genderOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {fieldErrors.gioi_tinh && <p className="mt-1 text-sm text-red-600">{fieldErrors.gioi_tinh}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="dia_chi">
                Địa chỉ bạn đang sinh sống *
              </label>
              <textarea
                id="dia_chi"
                name="dia_chi"
                value={formData.dia_chi}
                onChange={handleInputChange}
                className="form-input resize-none"
                rows={3}
                required
              />
              <p className="mt-1 text-xs text-gray-500">Địa chỉ này giúp BTC gửi quà đúng nơi.</p>
              {fieldErrors.dia_chi && <p className="mt-1 text-sm text-red-600">{fieldErrors.dia_chi}</p>}
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="email">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                required
              />
              {fieldErrors.email && <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="telegram">
                Username Telegram *
              </label>
              <input
                id="telegram"
                name="telegram"
                placeholder="@username"
                value={formData.telegram}
                onChange={handleInputChange}
                className="form-input"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Đây là kênh liên lạc chính của chương trình. Vui lòng nhập chính xác.
              </p>
              {fieldErrors.telegram && <p className="mt-1 text-sm text-red-600">{fieldErrors.telegram}</p>}
            </div>
          </div>
        );
      case 'experience':
        return (
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Bạn đã từng tham gia 99 DAYS WITH NHILE các mùa trước chưa? *
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                {participationOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center justify-between rounded-lg border p-4 transition ${
                      formData.da_tham_gia_truoc === option.value
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-primary hover:text-primary'
                    }`}
                  >
                    <span>{option.label}</span>
                    <input
                      type="radio"
                      name="da_tham_gia_truoc"
                      value={option.value}
                      checked={formData.da_tham_gia_truoc === option.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                  </label>
                ))}
              </div>
              {fieldErrors.da_tham_gia_truoc && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.da_tham_gia_truoc}</p>
              )}
            </div>
            {isReturningParticipant ? (
              <div className="space-y-5">
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 text-sm leading-relaxed text-primary">
                  <h4 className="text-base font-semibold uppercase tracking-wide">Chào mừng trở lại</h4>
                  <p className="mt-2 text-primary/90">
                    Cảm ơn bạn đã quay lại thử thách! Hãy chia sẻ cảm nhận về những mùa trước trên mạng xã hội cá nhân
                    cùng các hashtag:
                  </p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-primary">
                    #99dayswithNhiLe #NhiLeTeam #NhiLe #thaydoibanthan #renluyensuckhoe #phattrienbanthan
                    #trothanhphienbantothonmoingay #Neducation #Lachinhminh
                  </p>
                  <p className="mt-3 text-primary/90">
                    Đội ngũ 99 DAYS WITH NHILE trân trọng sự lan tỏa của bạn và rất vui được đồng hành cùng bạn 99 ngày
                    sắp tới!
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="link_bai_chia_se">
                    Link bài chia sẻ *
                  </label>
                  <input
                    id="link_bai_chia_se"
                    name="link_bai_chia_se"
                    placeholder="https://"
                    value={formData.link_bai_chia_se}
                    onChange={handleInputChange}
                    className={`form-input ${linkErrorMessage ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Vui lòng đính kèm link bài viết về trải nghiệm 99 DAYS WITH NHILE cùng các hashtag trên.
                  </p>
                  {linkErrorMessage && (
                    <p className="mt-1 text-sm text-red-600">{linkErrorMessage}</p>
                  )}
                </div>
              </div>
            ) : null}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="muc_tieu">
                Mục tiêu bạn muốn đạt được sau 99 ngày? *
              </label>
              <textarea
                id="muc_tieu"
                name="muc_tieu"
                rows={4}
                value={formData.muc_tieu}
                onChange={handleInputChange}
                className={`form-input resize-none ${
                  fieldErrors.muc_tieu ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                }`}
                required
              />
              {fieldErrors.muc_tieu && <p className="mt-1 text-sm text-red-600">{fieldErrors.muc_tieu}</p>}
            </div>
          </div>
        );
      case 'discipline':
        return (
          <div className="space-y-6">
            {isReturningParticipant ? (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
                <p className="font-semibold text-gray-700">Chia sẻ thêm về bạn</p>
                <p className="mt-1">
                  Cho chúng mình biết thêm để hỗ trợ bạn tốt hơn trong hành trình 99 ngày sắp tới nhé.
                </p>
              </div>
            ) : null}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Bạn đánh giá mức độ kỷ luật hiện tại của mình *
              </p>
              {renderDisciplineScale()}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="ly_do">
                Điều gì khiến bạn quyết định tham gia chương trình này?
              </label>
              <textarea
                id="ly_do"
                name="ly_do"
                rows={4}
                value={formData.ly_do}
                onChange={handleInputChange}
                className="form-input resize-none"
                required
              />
              {fieldErrors.ly_do && <p className="mt-1 text-sm text-red-600">{fieldErrors.ly_do}</p>}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Bạn thường dậy lúc mấy giờ? *</p>
              <div className="grid gap-3 md:grid-cols-2">
                {wakeupOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center justify-between rounded-lg border p-4 transition ${
                      formData.thoi_gian_thuc_day === option.value
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-primary hover:text-primary'
                    }`}
                  >
                    <span>{option.label}</span>
                    <input
                      type="radio"
                      name="thoi_gian_thuc_day"
                      value={option.value}
                      checked={formData.thoi_gian_thuc_day === option.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                  </label>
                ))}
              </div>
              {fieldErrors.thoi_gian_thuc_day && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.thoi_gian_thuc_day}</p>
              )}
            </div>
          </div>
        );
      case 'habits':
        return (
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Trong 3 tháng qua, bạn tập thể dục (từ 30 phút/lần) với tần suất nào? *
              </p>
              <div className="space-y-3">
                {workoutFrequencyOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center justify-between rounded-lg border p-4 transition ${
                      formData.tan_suat_tap_the_duc === option.value
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-primary hover:text-primary'
                    }`}
                  >
                    <span>{option.label}</span>
                    <input
                      type="radio"
                      name="tan_suat_tap_the_duc"
                      value={option.value}
                      checked={formData.tan_suat_tap_the_duc === option.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                  </label>
                ))}
              </div>
              {fieldErrors.tan_suat_tap_the_duc && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.tan_suat_tap_the_duc}</p>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Mức độ vận động thể chất trung bình mỗi ngày *
              </p>
              {renderActivityScale()}
            </div>
          </div>
        );
      case 'health':
        return (
          <div className="space-y-6">
            <div>
              <label
                className="block text-sm font-semibold text-gray-700 mb-2"
                htmlFor="tinh_trang_suc_khoe"
              >
                Tình trạng sức khỏe mà BTC cần lưu ý *
              </label>
              <textarea
                id="tinh_trang_suc_khoe"
                name="tinh_trang_suc_khoe"
                rows={4}
                value={formData.tinh_trang_suc_khoe}
                onChange={handleInputChange}
                className="form-input resize-none"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Ví dụ: huyết áp, tim mạch, chấn thương, ghi chú quan trọng...
              </p>
              {fieldErrors.tinh_trang_suc_khoe && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.tinh_trang_suc_khoe}</p>
              )}
            </div>
            <div className="flex items-start space-x-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <input
                id="dong_y"
                name="dong_y"
                type="checkbox"
                checked={formData.dong_y}
                onChange={handleInputChange}
                className="mt-1 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="dong_y" className="text-sm leading-relaxed text-gray-700">
                Tôi đã đọc và đồng ý với các điều khoản của chương trình và cam kết tham gia đầy đủ.
              </label>
            </div>
            {fieldErrors.dong_y && <p className="mt-1 text-sm text-red-600">{fieldErrors.dong_y}</p>}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section id="dang-ky" className="bg-primary py-20 text-white">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Chào mừng bạn đến với 99 DAYS WITH NHILE</h2>
          <p className="mx-auto mt-4 max-w-2xl">
            Hoàn thành từng bước ngắn gọn bên dưới để chúng mình hiểu bạn hơn và đồng hành trọn vẹn 99 ngày.
          </p>
        </div>

        <div
          ref={cardRef}
          className="mx-auto max-w-3xl rounded-2xl bg-white p-6 text-gray-900 shadow-2xl md:p-10"
        >
          {status !== 'success' && (
            <div className="mb-8 space-y-6">
              {StepIndicator}
              <div>
                <div className="h-1.5 w-full rounded-full bg-primary/10">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="mt-2 text-xs font-semibold uppercase tracking-wide text-primary">
                  {Math.round(progressPercent)}% hoàn thành
                </div>
              </div>
            </div>
          )}

          {status === 'success' ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-700">
              <h3 className="text-xl font-semibold">Cảm ơn bạn đã chia sẻ!</h3>
              <p className="mt-2">
                Bạn hãy kiểm tra email để nhận link vào nhóm Telegram 99 DAYS WITH NHILE Season 5 nhé!
                Chúc bạn kiên trì và bền bỉ.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-primary">{activeStep.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{activeStep.description}</p>
                <div className="mt-6 space-y-6">{renderStepContent()}</div>
              </div>

              {errorMessage && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="text-sm text-gray-500">
                  Bước {currentStep + 1}/{totalSteps}
                </div>
                <div className="flex flex-col gap-3 md:flex-row">
                  {currentStep > 0 && (
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="w-full rounded-full border border-primary px-6 py-3 font-semibold text-primary transition-all duration-300 hover:bg-primary/10 md:w-auto"
                      disabled={baseButtonDisabled}
                    >
                      Quay lại
                    </button>
                  )}
                  {currentStep < totalSteps - 1 && (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="btn-primary w-full md:w-auto"
                      disabled={nextStepDisabled}
                    >
                      Tiếp tục
                    </button>
                  )}
                  {currentStep === totalSteps - 1 && (
                    <button
                      type="submit"
                      className="btn-primary w-full md:w-auto"
                      disabled={submitDisabled}
                    >
                      {isCheckingEmail
                        ? 'Đang kiểm tra email...'
                        : isSubmitting
                        ? 'Đang gửi...'
                        : 'Gửi đăng ký'}
                    </button>
                  )}
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default RegistrationSection;
