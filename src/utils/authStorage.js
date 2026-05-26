const ACCOUNTS_KEY = 'loma_auth_accounts';
const SESSION_KEY = 'loma_auth_session';

export function getAccounts() {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY)) || [];
  } catch {
    return [];
  }
}

export function registerAccount(account) {
  const accounts = getAccounts();
  const normalizedEmail = account.email.trim().toLowerCase();
  const exists = accounts.some(
    (item) => item.email === normalizedEmail && item.role === account.role
  );

  if (exists) {
    throw new Error('An account with this email already exists for this role.');
  }

  const newAccount = {
    ...account,
    id: crypto.randomUUID(),
    email: normalizedEmail,
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([...accounts, newAccount]));
  localStorage.setItem(SESSION_KEY, JSON.stringify(safeSession(newAccount)));
  return safeSession(newAccount);
}

export function authenticate({ role, email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const account = getAccounts().find(
    (item) => item.email === normalizedEmail && item.role === role && item.password === password
  );

  if (!account) {
    throw new Error('Email, password, or account type is incorrect.');
  }

  const session = safeSession(account);
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

function safeSession(account) {
  const { password, confirmPassword, ...session } = account;
  return session;
}
