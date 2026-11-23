# Money Manager — Phase 2 Roadmap (Supabase Integration)

**Current Status:** ✅ Phase 1 Complete (MVP with localStorage)  
**Live:** Production (`main` branch) on Vercel  
**Next Phase:** Supabase backend + sync  

---

## 📋 Phase 2: Supabase Backend Integration

### Why Phase 2?
- **Phase 1 is proven:** Money Manager works locally, data persists
- **Supabase adds:** Cloud backup, multi-device sync, team access (future)
- **Keep MVP lean:** Don't over-engineer before validation

### What Phase 2 Requires

#### 1. **Supabase Project Setup** (Julio's part)
- Create free account: https://supabase.com
- Create new project (Region: closest to Santiago, Chile)
- Get these values:
  - **Project URL:** `https://[your-project].supabase.co`
  - **Anon (public) key:** Safe to put in frontend
  - **Service role key:** Keep secret (backend only)

#### 2. **Database Schema** (I'll build)
Tables needed:
```sql
accounts (
  id UUID PRIMARY KEY,
  user_id UUID,
  name TEXT,
  type TEXT (Cash/Checking/Savings/Credit Card),
  balance DECIMAL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

transactions (
  id UUID PRIMARY KEY,
  user_id UUID,
  description TEXT,
  amount DECIMAL,
  type TEXT (income/expense/transfer),
  category TEXT,
  account_id UUID (FK to accounts),
  date DATE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

categories (
  id UUID PRIMARY KEY,
  user_id UUID,
  name TEXT,
  type TEXT (income/expense),
  created_at TIMESTAMP
)
```

#### 3. **Code Changes** (I'll implement)
- Keep localStorage as **local cache**
- Add Supabase client library
- Sync on app load: cloud → browser
- Sync on save: browser → cloud
- Handle offline mode gracefully

#### 4. **Features Phase 2 Unlocks**
- ✅ Data accessible on phone via Vercel
- ✅ Cloud backup (doesn't delete on browser cache clear)
- ✅ Multi-tab sync (edit in one tab, see update in another)
- ✅ Undo/restore deleted items (audit log)
- 🔜 Team sharing (future, requires auth redesign)

---

## 🚀 When to Start Phase 2?

**Trigger Phase 2 when:**
1. ✅ Julio has used Money Manager for 1-2 weeks
2. ✅ He wants data on his phone
3. ✅ He needs cloud backup
4. ✅ Feature requests plateau (no new Phase 1 asks)

**Don't start Phase 2 if:**
- ❌ Money Manager is still buggy
- ❌ Julio rarely uses it
- ❌ He's happy with localhost-only

---

## 📝 Phase 2 Checklist

When ready, I'll:
- [ ] Create Supabase tables
- [ ] Add Supabase client to frontend
- [ ] Implement sync logic (load, save, conflict resolution)
- [ ] Add offline indicator
- [ ] Test multi-device sync
- [ ] Update Money Manager docs

---

## 🔐 Security Notes

**Phase 1 (current):**
- No authentication
- Data in browser localStorage (anyone with access = can read it)
- ✅ Fine for Julio solo

**Phase 2 will add:**
- Supabase auth (email/password or social)
- Row-level security (each user only sees their data)
- API keys scoped to Money Manager actions only

---

## 💡 Questions for Phase 2?

- Should Money Manager be shared with the studio (team view)?
- Do you want audit trail (who changed what, when)?
- Should deleted items go to trash bin first?

---

**Last Updated:** November 23, 2026  
**Phase 1 Complete:** ✅  
**Production Ready:** ✅  
**Next Phase:** 🔮 (when you're ready)
