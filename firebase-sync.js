import {
  consultationUrl,
  firebaseConfig,
  isConsultationUrlConfigured,
  isFirebaseConfigured
} from './firebase-config.js';

const MAX_PUBLICATION_BYTES = 900000;
const LAST_SYNC_KEY = 'cbsleiria.firebase.lastConsultationSync';
const button = document.getElementById('firebase-sync-button');
const status = document.getElementById('firebase-sync-status');
const dialog = document.getElementById('firebase-auth-dialog');
const form = document.getElementById('firebase-auth-form');
const emailInput = document.getElementById('firebase-admin-email');
const passwordInput = document.getElementById('firebase-admin-password');
const authError = document.getElementById('firebase-auth-error');
const signOutButton = document.getElementById('firebase-sign-out');
const consultationLink = document.getElementById('consultation-page-link');

let auth;
let database;
let firebaseApi;
let pendingSync = false;
let busy = false;

function setStatus(text, error = false) {
  status.textContent = text;
  status.classList.toggle('error', error);
}

function portugueseError(error) {
  const code = String(error?.code || '');
  if (code.includes('invalid-credential')) return 'Email ou password incorretos.';
  if (code.includes('too-many-requests')) return 'Demasiadas tentativas. Aguarde antes de voltar a tentar.';
  if (code.includes('network-request-failed') || !navigator.onLine) return 'Sem ligação ao Firebase. A publicação anterior não foi alterada.';
  if (code.includes('permission-denied')) return 'Esta conta não tem autorização para sincronizar.';
  return 'Não foi possível concluir a sincronização com o Firebase.';
}

function sanitizedRecords() {
  const source = globalThis.CBSLRadioData?.getSirespConsultationRecords?.();
  if (!Array.isArray(source)) throw new Error('Dados locais indisponíveis');
  return source.map(record => ({
    id: String(record.id || ''),
    portableNumber: String(record.portableNumber || ''),
    type: String(record.type || ''),
    issi: String(record.issi || ''),
    serialNumber: String(record.serialNumber || ''),
    brand: String(record.brand || ''),
    model: String(record.model || ''),
    allocatedTo: String(record.allocatedTo || ''),
    status: String(record.status || ''),
    location: String(record.location || '')
  }));
}

function publicationSize(records) {
  return new TextEncoder().encode(JSON.stringify({ schemaVersion: 1, recordCount: records.length, records })).length;
}

function confirmPublication(count) {
  if (!confirm(`Publicar ${count} rádio(s) SIRESP na página de consulta? A publicação anterior será substituída.`)) return false;
  if (count === 0) {
    return prompt('A lista SIRESP está vazia. Para confirmar a remoção de todos os dados publicados, escreva PUBLICAR VAZIO:') === 'PUBLICAR VAZIO';
  }
  return true;
}

async function publish() {
  if (busy || !auth?.currentUser) return;
  if (!navigator.onLine) {
    setStatus('Sem Internet — a publicação anterior mantém-se.', true);
    return;
  }

  const records = sanitizedRecords();
  if (!confirmPublication(records.length)) {
    setStatus('Sincronização cancelada.');
    return;
  }

  const bytes = publicationSize(records);
  if (bytes > MAX_PUBLICATION_BYTES) {
    setStatus(`Publicação demasiado grande (${Math.ceil(bytes / 1024)} KB). Nenhum dado foi alterado.`, true);
    return;
  }

  busy = true;
  button.disabled = true;
  setStatus(`A publicar ${records.length} rádio(s) SIRESP…`);
  try {
    await firebaseApi.setDoc(firebaseApi.doc(database, 'publicacoes', 'siresp'), {
      schemaVersion: 1,
      updatedAt: firebaseApi.serverTimestamp(),
      updatedByUid: auth.currentUser.uid,
      recordCount: records.length,
      records
    });
    const completedAt = new Date().toISOString();
    localStorage.setItem(LAST_SYNC_KEY, completedAt);
    setStatus(`Última sincronização: ${new Intl.DateTimeFormat('pt-PT', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(completedAt))} · ${records.length} rádio(s)`);
  } catch (error) {
    setStatus(portugueseError(error), true);
  } finally {
    busy = false;
    button.disabled = false;
  }
}

async function requestSync() {
  if (!isFirebaseConfigured()) {
    setStatus('Preencha firebase-config.js antes de sincronizar.', true);
    return;
  }
  if (!auth || !database) {
    setStatus('O Firebase ainda está a iniciar. Tente novamente dentro de momentos.', true);
    return;
  }
  if (auth.currentUser) {
    await publish();
    return;
  }
  pendingSync = true;
  authError.textContent = '';
  passwordInput.value = '';
  dialog.showModal();
  emailInput.focus();
}

async function authenticate(event) {
  event.preventDefault();
  authError.textContent = '';
  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = true;
  try {
    await firebaseApi.signInWithEmailAndPassword(auth, emailInput.value.trim(), passwordInput.value);
    passwordInput.value = '';
    dialog.close();
    if (pendingSync) {
      pendingSync = false;
      await publish();
    }
  } catch (error) {
    authError.textContent = portugueseError(error);
  } finally {
    submit.disabled = false;
  }
}

async function signOutManagement() {
  if (!auth?.currentUser || busy) return;
  try {
    await firebaseApi.signOut(auth);
    setStatus('Autorização Firebase removida deste dispositivo.');
  } catch (error) {
    setStatus(portugueseError(error), true);
  }
}

async function boot() {
  button.addEventListener('click', requestSync);
  signOutButton.addEventListener('click', signOutManagement);
  form.addEventListener('submit', authenticate);
  document.querySelectorAll('[data-close-firebase]').forEach(control => control.addEventListener('click', () => {
    pendingSync = false;
    dialog.close();
  }));

  if (isConsultationUrlConfigured()) {
    consultationLink.href = consultationUrl;
    consultationLink.classList.remove('hidden');
  }

  if (!isFirebaseConfigured()) {
    setStatus('Firebase por configurar — consulte GUIA_FIREBASE_GITHUB.md', true);
    return;
  }

  try {
    const [appSdk, authSdk, firestoreSdk] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js'),
      import('https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js')
    ]);
    firebaseApi = { ...authSdk, ...firestoreSdk };
    const app = appSdk.initializeApp(firebaseConfig, 'cbsleiria-management');
    auth = authSdk.getAuth(app);
    database = firestoreSdk.getFirestore(app);
    await authSdk.setPersistence(auth, authSdk.browserLocalPersistence);
    button.disabled = false;
    authSdk.onAuthStateChanged(auth, user => {
      signOutButton.classList.toggle('hidden', !user);
      if (user) setStatus(`Firebase autorizado neste dispositivo como ${user.email}. Pronto para sincronizar.`);
      else {
        const lastSync = localStorage.getItem(LAST_SYNC_KEY);
        setStatus(lastSync ? `Pronto para sincronizar · última: ${new Intl.DateTimeFormat('pt-PT', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(lastSync))}` : 'Pronto para a primeira sincronização.');
      }
    });
  } catch (error) {
    auth = null;
    database = null;
    setStatus(navigator.onLine ? 'Configuração Firebase inválida.' : 'Sem Internet — sincronização indisponível.', true);
  }
}

boot();
