// Legacy migration entry point; latest implementation owns all hooks.
export {
 patchOperatingSystem1637 as patchOperatingSystem1636,
 operatingSystem1637Update as operatingSystem1636Update,
 operatingSystem1637EffectUpdate as operatingSystem1636EffectUpdate,
 migrateOperatingSystems1637 as migrateOperatingSystems1636,
} from './operating-system-revision-1637.mjs';
