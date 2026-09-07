/* ==========================================================================
   Demo payment-method store.
   - Cards are stored as tokenised "demo" entries (last 4 + brand only).
   - The full PAN is never persisted; the demo simulates a PSP tokenisation.
   - OTP verification is enforced before each charge.
   ========================================================================== */

const METHODS_KEY = 'bw_payment_methods';
const OTP_KEY = 'bw_payment_otp';

const SEED = [];

function readMethods() {
  try {
    const raw = localStorage.getItem(METHODS_KEY);
    if (!raw) {
      localStorage.setItem(METHODS_KEY, JSON.stringify(SEED));
      return [...SEED];
    }
    return JSON.parse(raw);
  } catch {
    return [...SEED];
  }
}
function writeMethods(arr) {
  localStorage.setItem(METHODS_KEY, JSON.stringify(arr));
}

/* ---------- public API ---------- */

export function listMethods() {
  return readMethods();
}

export function addMethod(input) {
  const { pan, holder, expiry, brand = 'Visa' } = input;
  if (!/^\d{16}$/.test(pan.replace(/\s/g, ''))) {
    throw new Error('Card number must be 16 digits.');
  }
  if (!holder?.trim()) throw new Error('Cardholder name is required.');
  if (!/^\d{2}\/\d{2}$/.test(expiry)) throw new Error('Expiry must be MM/YY.');

  const last4 = pan.replace(/\s/g, '').slice(-4);
  const methods = readMethods();
  const id = 'PM-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  const method = {
    id,
    brand,
    last4,
    holder: holder.trim(),
    expiry,
    token: 'tok_demo_' + Math.random().toString(36).slice(2, 12),
    addedAt: new Date().toISOString().slice(0, 10),
    isDefault: methods.length === 0,
  };
  methods.push(method);
  writeMethods(methods);
  return method;
}

export function removeMethod(id) {
  writeMethods(readMethods().filter((m) => m.id !== id));
}

export function setDefaultMethod(id) {
  const methods = readMethods().map((m) => ({ ...m, isDefault: m.id === id }));
  writeMethods(methods);
}

/* ---------- OTP ---------- */

export function issueOtp(methodId) {
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  try {
    localStorage.setItem(OTP_KEY, JSON.stringify({
      methodId,
      otp,
      issuedAt: Date.now(),
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    }));
  } catch { /* */ }
  return otp; // returned for the demo so the UI can show it
}

export function verifyOtp(input, methodId) {
  try {
    const raw = localStorage.getItem(OTP_KEY);
    if (!raw) throw new Error('No OTP issued. Please request a new code.');
    const record = JSON.parse(raw);
    if (record.methodId !== methodId) throw new Error('OTP is for a different card. Request a new code.');
    if (Date.now() > record.expiresAt) throw new Error('OTP expired. Request a new code.');
    if (String(record.otp) !== String(input)) throw new Error('Incorrect code.');
    return true;
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error('OTP verification failed.');
  }
}