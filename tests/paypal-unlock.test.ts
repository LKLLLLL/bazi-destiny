import assert from 'node:assert/strict';
import { isUnlocked, resolveUnlock } from '../src/lib/paypal.ts';

class MemoryStorage {
  private values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, String(value)); }
  removeItem(key: string) { this.values.delete(key); }
  clear() { this.values.clear(); }
}

const storage = new MemoryStorage();
const location = { search: '?payment=success', pathname: '/calculator.html', hash: '' };
Object.assign(globalThis, {
  localStorage: storage,
  window: {
    location,
    history: { replaceState: () => { location.search = ''; } },
  },
  document: { title: 'test' },
});

assert.deepEqual(resolveUnlock(), { unlocked: false, pending: null }, 'direct success visit must not unlock');

storage.setItem('pendingTier', 'synergy');
storage.setItem('pendingReading', JSON.stringify({ n1: 'A', n2: 'B', e1: 'Wood', e2: 'Fire' }));
location.search = '?payment=success';
const synergy = resolveUnlock('synergy');
assert.equal(synergy.unlocked, true);
assert.equal(isUnlocked('synergy'), true);
assert.equal(isUnlocked('pro'), false, 'synergy purchase must not unlock Life Blueprint');

storage.clear();
storage.setItem('pendingTier', 'ultimate');
storage.setItem('pendingReading', JSON.stringify({ date: '1990-06-15', pillars: {} }));
location.search = '?payment=success';
const ultimate = resolveUnlock();
assert.equal(ultimate.unlocked, true);
assert.equal(isUnlocked('pro'), true, 'ultimate purchase must include Life Blueprint access');
assert.equal(isUnlocked('synergy'), false);

console.log('paypal-unlock: return validation and tier isolation passed');
