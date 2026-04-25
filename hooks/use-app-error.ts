/**
 * Translates an AppError into a user-facing i18n key using ts-pattern.
 */
import { useTranslation } from 'react-i18next';
import { match } from 'ts-pattern';
import type { AppError } from '@/domain/types';

export const useAppError = () => {
  const { t } = useTranslation();

  const errorMessage = (error: AppError): string =>
    match(error)
      .with({ _tag: 'NetworkError' }, () => t('error.network'))
      .with({ _tag: 'LocationPermissionDenied' }, () => t('error.locationDenied'))
      .with({ _tag: 'LocationUnavailable' }, () => t('error.locationUnavailable'))
      .with({ _tag: 'DecodeError' }, () => t('error.decode'))
      .with({ _tag: 'UnknownError' }, () => t('error.unknown'))
      .exhaustive();

  return { errorMessage };
};
