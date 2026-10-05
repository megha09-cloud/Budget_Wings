import { useEffect, useMemo, useState } from 'react';

const api = async (p, o = {}) => {
  const tk = localStorage.getItem('bw_token'); let r;
  try { r = await fetch('/api' + p, { method: o.method || 'GET', headers: { ...(o.body ? { 'Content-Type': 'application/json' } : {}), ...(tk ? { Authorization: 'Bearer ' + tk } : {}) }, body: o.body ? JSON.stringify(o.body) : undefined }); }
  catch { throw Object.assign(new Error('We can’t reach Budget Wings right now. Check your connection and try again.'), { code: 'NETWORK' }); }
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(d.error || 'Something went wrong. Please try again.'), { code: d.code, status: r.status });
  return d;
};
const hm = m => `${Math.floor(m / 60)}h ${m % 60}m`, tm = s => (s || '').slice(11, 16), inr = n => '₹' + Number(n).toLocaleString('en-IN');
const bucket = s => { const h = +(s || '').slice(11, 13); return h < 6 ? 'night' : h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening'; };
const ymd = (add = 0) => { const d = new Date(); d.setDate(d.getDate() + add); return d.toLocaleDateString('en-CA'); };
const CABINS = ['Economy', 'Premium Economy', 'Business', 'First Class'];
const SORTS = { lowest: 'Lowest Price', fastest: 'Fastest', best: 'Best' };
const NOF = { airlines: [], maxPrice: null, maxDur: null, stops: 'any', times: [], arr: [], cabins: [] };
const BUCKETS = ['morning', 'afternoon', 'evening', 'night'];
const fkey = x => x.key || x.flightNumbers.join('+') + '|' + x.departure;
const fromSaved = s => ({ id: s._id, key: s.key, airlines: [s.airline], flightNumbers: [s.flightNumber], logo: s.logo, from: { code: s.origin }, to: { code: s.destination }, departure: s.departure, arrival: s.arrival, durationMin: s.durationMin, stops: s.stops, price: s.price, cabin: s.cabin, cabins: s.cabin ? [s.cabin] : [], segments: s.segments || [], layovers: s.layovers || [], carbonGrams: null });
const EMPTY = { totalSearches: 0, savedCount: 0, recentSearches: [], recentSaved: [] };
const NAV = [['home', 'Home'], ['search', 'Search Flights', 1], ['dashboard', 'Dashboard', 1], ['saved', 'Saved Flights', 1], ['history', 'Search History', 1], ['profile', 'Profile', 1]];

export default function App() {
  const [user, setUser] = useState(null), [ready, setReady] = useState(false), [page, setPageRaw] = useState('home'), [modal, setModal] = useState(null), [menu, setMenu] = useState(false), [note, setNote] = useState('');
  const [f, setF] = useState({ from: 'Delhi (DEL)', to: 'Mumbai (BOM)', date: ymd(7), pax: 1, cabin: 1 }), [formErr, setFormErr] = useState('');
  const [st, setSt] = useState('idle'), [res, setRes] = useState(null), [err, setErr] = useState('');
  const [sort, setSort] = useState('lowest'), [flt, setFlt] = useState(NOF), [drawer, setDrawer] = useState(false), [open, setOpen] = useState(null), [cmp, setCmp] = useState([]), [showCmp, setShowCmp] = useState(false);
  const [saved, setSaved] = useState([]), [hist, setHist] = useState([]), [dash, setDash] = useState(null);
  const setPage = p => { setPageRaw(p); setMenu(false); setOpen(null); window.scrollTo(0, 0); };
  const toast = m => { setNote(m); setTimeout(() => setNote(''), 4500); };

  const loadAcct = () => Promise.all([api('/users/dashboard').then(setDash), api('/saved-flights').then(setSaved), api('/search-history').then(setHist)]).catch(e => { if (e.status === 401) logout(); });
  useEffect(() => { if (localStorage.getItem('bw_token')) api('/auth/me').then(setUser).catch(() => localStorage.removeItem('bw_token')).finally(() => setReady(true)); else setReady(true); }, []);
  useEffect(() => { if (user) loadAcct(); }, [user]);
  const logout = () => { localStorage.removeItem('bw_token'); setUser(null); setSaved([]); setHist([]); setDash(null); setPage('home'); };

  const run = async (ff = f) => {
    setFormErr('');
    if (!ff.from.trim() || !ff.to.trim() || !ff.date) return setFormErr('Please fill in From, To and Departure Date.');
    if (ff.from.trim().toLowerCase() === ff.to.trim().toLowerCase()) return setFormErr('Departure and destination cannot be the same.');
    if (ff.date < ymd()) return setFormErr('Please choose today or a future date.');
    setSt('loading'); setErr(''); setFlt(NOF); setOpen(null); setCmp([]);
    try { setRes(await api(`/flights/search?from=${encodeURIComponent(ff.from.trim())}&to=${encodeURIComponent(ff.to.trim())}&date=${ff.date}&passengers=${ff.pax}&cabin=${ff.cabin}`)); setSt('done'); if (user) loadAcct(); }
    catch (e) {
      if (['AIRPORT_NOT_FOUND', 'SAME_AIRPORT', 'EMPTY_INPUT', 'INVALID_DATE', 'INVALID_PASSENGERS', 'INVALID_CABIN'].includes(e.code)) { setFormErr(e.message); setSt('idle'); } else { setErr(e.message); setSt('error'); }
    }
  };
  const again = h => { const d = h.travelDate.slice(0, 10), nf = { from: h.originLabel || h.origin, to: h.destinationLabel || h.destination, date: d < ymd() ? ymd(7) : d, pax: h.passengers, cabin: h.cabin || 1 }; setF(nf); setPage(page === 'dashboard' ? 'dashboard' : 'search'); run(nf); };
  const toggleSave = async x => {
    if (!user) { toast('Please log in or sign up to save flights.'); return setModal('login'); }
    try {
      const k = fkey(x), ex = saved.find(s => s.key === k);
      if (ex) await api('/saved-flights/' + ex._id, { method: 'DELETE' }); else await api('/saved-flights', { method: 'POST', body: x });
      await loadAcct();
    } catch (e) { toast('We couldn’t update your saved flights. Please try again.'); }
  };

  // ---- results processing (all from real API data)
  const flights = res?.flights || [];
  const base = useMemo(() => { const mp = Math.min(...flights.map(x => x.price)), md = Math.min(...flights.map(x => x.durationMin));
    return { minP: mp, maxP: Math.max(...flights.map(x => x.price)), maxD: Math.max(...flights.map(x => x.durationMin)), airlines: [...new Set(flights.flatMap(x => x.airlines))].sort(), cabins: [...new Set(flights.flatMap(x => x.cabins?.length ? x.cabins : [x.cabin]).filter(Boolean))],
      list: flights.map(x => ({ ...x, score: -(x.price / mp + 0.5 * x.durationMin / md + 0.2 * x.stops) + (x.best ? 0.3 : 0) })) }; }, [flights]);
  const visible = useMemo(() => base.list.filter(x =>
    (!flt.airlines.length || x.airlines.some(a => flt.airlines.includes(a))) && (flt.maxPrice == null || x.price <= flt.maxPrice) && (flt.maxDur == null || x.durationMin <= flt.maxDur) &&
    (flt.stops === 'any' || (flt.stops === '2' ? x.stops >= 2 : x.stops === +flt.stops)) && (!flt.times.length || flt.times.includes(bucket(x.departure))) && (!flt.arr.length || flt.arr.includes(bucket(x.arrival))) &&
    (!flt.cabins.length || (x.cabins?.length ? x.cabins : [x.cabin]).some(c => flt.cabins.includes(c)))
  ).sort(sort === 'best' ? (a, b) => b.score - a.score : sort === 'fastest' ? (a, b) => a.durationMin - b.durationMin || a.price - b.price : (a, b) => a.price - b.price), [base, flt, sort]);
  const pick = (fn) => visible.length ? visible.reduce((m, x) => (fn(x, m) ? x : m)).id : null;
  const cheapId = pick((x, m) => x.price < m.price), fastId = pick((x, m) => x.durationMin < m.durationMin), bestId = pick((x, m) => x.score > m.score);
  const tog = (k, v) => setFlt(x => ({ ...x, [k]: x[k].includes(v) ? x[k].filter(i => i !== v) : [...x[k], v] }));
  const tags = x => [x.id === cheapId && 'CHEAPEST', x.id === bestId && 'BEST', x.id === fastId && 'FASTEST'].filter(Boolean);

  const Filters = (<div className="filters">
    <div className="fh"><h3>Filters</h3><button className="link" onClick={() => setFlt(NOF)}>Reset</button></div>
    <h4>Airline</h4>{base.airlines.map(a => <label key={a}><input type="checkbox" checked={flt.airlines.includes(a)} onChange={() => tog('airlines', a)} />{a}</label>)}
    <h4>Max price: {inr(flt.maxPrice ?? base.maxP)}</h4><input type="range" min={base.minP} max={base.maxP} value={flt.maxPrice ?? base.maxP} onChange={e => setFlt({ ...flt, maxPrice: +e.target.value })} />
    <h4>Stops</h4>{[['any', 'Any'], ['0', 'Non-stop'], ['1', '1 stop'], ['2', '2+ stops']].map(([v, l]) => <label key={v}><input type="radio" checked={flt.stops === v} onChange={() => setFlt({ ...flt, stops: v })} />{l}</label>)}
    {base.cabins.length > 0 && <><h4>Cabin class</h4>{base.cabins.map(c => <label key={c}><input type="checkbox" checked={flt.cabins.includes(c)} onChange={() => tog('cabins', c)} />{c}</label>)}</>}
    <h4>Departure time</h4><div className="chips">{BUCKETS.map(t => <button key={t} className={flt.times.includes(t) ? 'chip on' : 'chip'} onClick={() => tog('times', t)}>{t}</button>)}</div>
    <h4>Arrival time</h4><div className="chips">{BUCKETS.map(t => <button key={t} className={flt.arr.includes(t) ? 'chip on' : 'chip'} onClick={() => tog('arr', t)}>{t}</button>)}</div>
    <h4>Max duration: {hm(flt.maxDur ?? base.maxD)}</h4><input type="range" min="30" max={base.maxD} step="10" value={flt.maxDur ?? base.maxD} onChange={e => setFlt({ ...flt, maxDur: +e.target.value })} />
  </div>);

  const searchBox = (<form className="search" onSubmit={e => { e.preventDefault(); run(); }}>
    <AirportInput label="From" value={f.from} onChange={v => setF(x => ({ ...x, from: v }))} />
    <button type="button" className="swap" onClick={() => setF(x => ({ ...x, from: x.to, to: x.from }))} aria-label="Swap airports">⇄</button>
    <AirportInput label="To" value={f.to} onChange={v => setF(x => ({ ...x, to: v }))} />
    <label className="fld sm">Departure Date<input type="date" min={ymd()} value={f.date} onChange={e => setF({ ...f, date: e.target.value })} /></label>
    <label className="fld xs">Passengers<select value={f.pax} onChange={e => setF({ ...f, pax: +e.target.value })}>{[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => <option key={n}>{n}</option>)}</select></label>
    <label className="fld sm">Cabin Class<select value={f.cabin} onChange={e => setF({ ...f, cabin: +e.target.value })}>{CABINS.map((c, i) => <option key={c} value={i + 1}>{c}</option>)}</select></label>
    <button className="go" disabled={st === 'loading'}>{st === 'loading' ? 'SEARCHING…' : 'SEARCH FLIGHTS'}</button>
    {formErr && <div className="msg warn" role="alert">{formErr}</div>}
  </form>);

  const cmpFlights = cmp.map(id => base.list.find(x => x.id === id)).filter(Boolean);
  const results = (<>
    {st === 'loading' && <div className="list wrap">{[1, 2, 3, 4].map(i => <div key={i} className="card skel" />)}</div>}
    {st === 'error' && <div className="state wrap"><div className="big">⚠️</div><h3>We couldn’t load flights</h3><p>{err}</p><button className="go" onClick={() => run()}>Try again</button></div>}
    {st === 'done' && !flights.length && <div className="state wrap"><div className="big">🛫</div><h3>No flights found</h3><p>Try another date, cabin class or nearby airport.</p></div>}
    {st === 'done' && flights.length > 0 && <div className="wrap layout">
      <aside className="side">{Filters}</aside>
      <div><div className="bar"><b>{res?.query?.fromLabel} → {res?.query?.toLabel} · {visible.length} of {flights.length}</b>
        <button className="chip fbtn" onClick={() => setDrawer(true)}>Filters</button>
        <div className="seg-ctl" role="tablist">{Object.entries(SORTS).map(([k, l]) => <button key={k} className={sort === k ? 'on' : ''} onClick={() => setSort(k)}>{l}</button>)}</div></div>
        {cmp.length > 0 && <div className="cmpbar"><span>{cmp.length} selected</span><button className="go sm2" disabled={cmp.length < 2} onClick={() => setShowCmp(true)}>Compare</button><button className="link" onClick={() => setCmp([])}>Clear</button></div>}
        {!visible.length && <div className="state"><h3>No flights match your filters</h3><button className="link" onClick={() => setFlt(NOF)}>Reset filters</button></div>}
        <div className="list">{visible.map(x => <Card key={x.id} x={x} tags={tags(x)} open={open === x.id} toggle={() => setOpen(open === x.id ? null : x.id)} sel={cmp.includes(x.id)} onCmp={() => setCmp(c => c.includes(x.id) ? c.filter(i => i !== x.id) : c.length < 3 ? [...c, x.id] : (toast('You can compare up to 3 flights.'), c))} saved={saved.some(s => s.key === fkey(x))} onSave={() => toggleSave(x)} />)}</div></div></div>}
  </>);

  const d = dash || EMPTY, last = d.recentSearches[0], lastSaved = d.recentSaved[0];
  const histRows = list => list.map(h => <div key={h._id} className="hrow"><div><b>{h.originLabel || h.origin} → {h.destinationLabel || h.destination}</b>
    <small>{h.travelDate.slice(0, 10)} · {h.passengers} passenger{h.passengers > 1 ? 's' : ''} · {CABINS[(h.cabin || 1) - 1]} · searched {new Date(h.searchedAt).toLocaleString()}</small></div><button className="go sm2" onClick={() => again(h)}>SEARCH AGAIN</button></div>);
  const savedCards = list => <div className="list">{list.map(s => { const x = fromSaved(s); return <Card key={s._id} x={x} tags={[]} note="Fare when saved" open={open === s._id} toggle={() => setOpen(open === s._id ? null : s._id)} saved onSave={() => toggleSave(x)} />; })}</div>;
  const emptySaved = <div className="state"><div className="big">☆</div><h3>No saved flights yet.</h3><p>Start searching and save flights you want to keep.</p><button className="go" onClick={() => setPage('search')}>SEARCH FLIGHTS</button></div>;
  const emptyHist = <div className="state"><div className="big">🧭</div><h3>No searches yet.</h3><button className="go" onClick={() => setPage('search')}>SEARCH FLIGHTS</button></div>;

  if (!ready) return <div className="state">Loading…</div>;
  const protectedPage = ['search', 'dashboard', 'saved', 'history', 'profile'].includes(page);
  const cur = protectedPage && !user ? 'home' : page;
  const dark = cur === 'home' || cur === 'dashboard';

  return (<>
    <header className={'nav' + (dark ? '' : ' solid')}><div className="logo" onClick={() => setPage(user ? 'dashboard' : 'home')}>✈ Budget Wings</div>
      <button className="burger" onClick={() => setMenu(!menu)} aria-label="Menu">☰</button>
      <nav className={menu ? 'open' : ''}>{NAV.filter(n => !n[2] || user).map(([k, l]) => <button key={k} className={cur === k ? 'on' : ''} onClick={() => setPage(k)}>{l}</button>)}
        {user ? <button onClick={logout}>Logout</button> : <><button onClick={() => setModal('login')}>Login</button><button className="pill" onClick={() => setModal('signup')}>Sign Up</button></>}</nav></header>
    {note && <div className="toast" role="alert">{note}</div>}

    {cur === 'home' && <><section className="hero"><Sky />
      <p className="eyebrow">BUDGET WINGS</p><h1>SMART TRAVEL FLIGHTS</h1><p className="sub"><b>Travel Smart. Fly Free.</b></p><p className="sub2">Find better flights, smarter fares, and travel that fits your budget.</p>{searchBox}</section>
      {results}
      <section className="wrap cats"><h2>Travel your way</h2><div className="grid">{[['💸', 'Cheapest Flights', 'Sort by lowest price and spot the CHEAPEST option instantly.'], ['🎓', 'Student Friendly', 'Compare fares across airlines and dates to keep trips affordable.'], ['🛋️', 'Premium Comfort', 'Search Premium Economy, Business and First Class cabins.'], ['💼', 'Business Travel', 'Filter by departure and arrival time to fit your schedule.']].map(([i, t, p]) => <div key={t} className="cat"><div className="ic">{i}</div><h3>{t}</h3><p>{p}</p></div>)}
        <div className="cat"><div className="ic">🌍</div><h3>Popular Destinations</h3><div className="chips">{['Delhi', 'Mumbai', 'Dubai', 'London', 'Singapore', 'Bangkok', 'Tokyo', 'Paris', 'New York'].map(c => <button key={c} className="chip" onClick={() => { setF(x => ({ ...x, to: c })); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>{c}</button>)}</div></div></div></section></>}

    {cur === 'search' && <section className="page"><div className="wrap"><h2>Search Flights</h2>{searchBox}</div>{results}</section>}

    {cur === 'dashboard' && <section className="hero dashhero"><Sky calm /><div className="wrap dashin">
      <h1 className="wel">Welcome back, {user.name}! ✈️</h1><p className="sub2">Ready to find your next flight?</p>
      <h3 className="sec">Quick Flight Search</h3>{searchBox}</div>
      {results}
      <div className="wrap dashin"><div className="stats">
        <button className="stat" onClick={() => setPage('history')}><b>{d.totalSearches}</b><span>Total searches</span></button>
        <button className="stat" onClick={() => setPage('saved')}><b>{d.savedCount}</b><span>Saved flights</span></button>
        <button className="stat" onClick={() => last ? again(last) : setPage('search')}><b className="sm">{last ? `${last.originLabel || last.origin} → ${last.destinationLabel || last.destination}` : '—'}</b><span>Recent search</span></button>
        <button className="stat" onClick={() => lastSaved ? setPage('saved') : setPage('search')}><b className="sm">{lastSaved ? `${lastSaved.origin} → ${lastSaved.destination} · ${inr(lastSaved.price)}` : '—'}</b><span>Recently saved</span></button></div>
        <div className="cols"><div className="panel"><div className="ph"><h3>Recent saved flights</h3><button className="link" onClick={() => setPage('saved')}>VIEW ALL SAVED FLIGHTS</button></div>{d.recentSaved.length ? savedCards(d.recentSaved) : emptySaved}</div>
          <div className="panel"><div className="ph"><h3>Recent searches</h3><button className="link" onClick={() => setPage('history')}>VIEW ALL HISTORY</button></div>{d.recentSearches.length ? <div className="hlist">{histRows(d.recentSearches)}</div> : emptyHist}
            <div className="ph prof"><h3>Profile</h3><button className="link" onClick={() => setPage('profile')}>View Profile</button></div><p className="mut"><b>{d.user?.name || user.name}</b><br />{d.user?.email || user.email}</p><button className="chip" onClick={logout}>Logout</button></div></div></div></section>}

    {cur === 'saved' && <section className="page wrap"><h2>Saved Flights</h2>{saved.length ? savedCards(saved) : emptySaved}</section>}
    {cur === 'history' && <section className="page wrap"><h2>Search History</h2>{hist.length ? <div className="hlist">{histRows(hist)}</div> : emptyHist}</section>}
    {cur === 'profile' && <section className="page wrap"><h2>Profile</h2><div className="panel prof2"><div className="avatar">{user.name[0]?.toUpperCase()}</div><div><h3>{user.name}</h3><p className="mut">{user.email}</p>
      <p>Member since {d.user?.createdAt ? new Date(d.user.createdAt).toLocaleDateString() : '—'}</p><p>{d.totalSearches} searches · {d.savedCount} saved flights</p><button className="go" onClick={logout}>Logout</button></div></div></section>}

    {showCmp && <div className="modal"><div className="back" onClick={() => setShowCmp(false)} /><div className="box wide"><h3>Compare flights</h3><div className="tbl"><table><tbody>
      {[['Airline', x => x.airlines.join(' + ')], ['Flight number', x => x.flightNumbers.join(', ')], ['Price', x => inr(x.price)], ['Duration', x => hm(x.durationMin)], ['Stops', x => x.stops || 'Non-stop'], ['Departure', x => `${tm(x.departure)} ${x.from.code}`], ['Arrival', x => `${tm(x.arrival)} ${x.to.code}`], ['Cabin', x => (x.cabins?.length ? x.cabins.join(', ') : x.cabin) || '—']].map(([l, fn]) => <tr key={l}><th>{l}</th>{cmpFlights.map(x => <td key={x.id}>{fn(x)}</td>)}</tr>)}
    </tbody></table></div><button className="go" onClick={() => setShowCmp(false)}>Close</button></div></div>}
    {drawer && <div className="drawer"><div className="sheet">{Filters}<button className="go" onClick={() => setDrawer(false)}>Show {visible.length} flights</button></div><div className="back" onClick={() => setDrawer(false)} /></div>}
    {modal && <Auth mode={modal} setMode={setModal} onDone={u => { setUser(u); setModal(null); setPage('dashboard'); }} />}
    <footer className="foot">© Budget Wings · Travel Smart. Fly Free.</footer>
  </>);
}

function Sky({ calm }) {
  return (<div className={'sky' + (calm ? ' calm' : '')} aria-hidden="true"><div className="glow" /><div className="cloud c1" /><div className="cloud c2" /><div className="cloud c3" /><div className="dots" />
    <svg className="arc" viewBox="0 0 800 200" preserveAspectRatio="none"><path d="M0 180 Q400 -60 800 160" /></svg><div className="plane">✈</div>{!calm && <div className="runway"><i /><i /><i /><i /><i /><i /><i /></div>}</div>);
}

function Card({ x, tags, open, toggle, sel, onCmp, saved, onSave, note }) {
  return (<article className={'card' + (tags.includes('CHEAPEST') ? ' best' : '')}>
    <div className="top"><div className="al">{x.logo && <img src={x.logo} alt="" onError={e => (e.target.style.display = 'none')} />}<div><b>{x.airlines.join(' + ')}</b><small>{x.flightNumbers.join(', ')}{x.cabin ? ' · ' + x.cabin : ''}</small></div></div>
      <div className="pr"><div className="tags">{tags.map(t => <span key={t} className={'badge ' + t}>{t}</span>)}</div><strong>{inr(x.price)}</strong><small>{note || (x.currency || 'INR')}</small></div></div>
    <div className="mid"><div><b>{tm(x.departure)}</b><small>{x.from.code}</small></div><div className="line"><span>{hm(x.durationMin)}</span><i /><span>{x.stops ? `${x.stops} stop${x.stops > 1 ? 's' : ''}` : 'Non-stop'}</span></div><div className="r"><b>{tm(x.arrival)}</b><small>{x.to.code}</small></div></div>
    <div className="acts"><button className="link" onClick={toggle} aria-expanded={open}>{open ? 'Hide Details' : 'View Details'}</button>
      {onCmp && <label className="cmp"><input type="checkbox" checked={sel} onChange={onCmp} /> Compare</label>}
      <button className={'link save' + (saved ? ' on' : '')} onClick={onSave}>{note ? 'Remove' : saved ? '★ Saved' : '☆ Save Flight'}</button></div>
    {open && <div className="det">{x.segments.length === 0 && <div className="seg lay">No extra details were returned for this flight.</div>}
      {x.segments.map((s, i) => <div key={i} className="seg"><b>{s.airline} {s.flightNumber}</b> · {s.fromName || s.from} ({s.from}) {tm(s.departure)} → {s.toName || s.to} ({s.to}) {tm(s.arrival)}{s.durationMin ? ' · ' + hm(s.durationMin) : ''}
        <small>{[s.travelClass, s.aircraft, s.legroom && 'Legroom ' + s.legroom].filter(Boolean).join(' · ')}</small></div>)}
      {x.layovers.map((l, i) => <div key={i} className="seg lay">Layover at {l.airport} ({l.code}){l.durationMin ? ` · ${hm(l.durationMin)}` : ''}</div>)}
      {x.carbonGrams && <div className="seg lay">CO₂: {(x.carbonGrams / 1000).toFixed(0)} kg</div>}</div>}
  </article>);
}

function AirportInput({ label, value, onChange }) {
  const [opts, setOpts] = useState([]), [show, setShow] = useState(false), [hi, setHi] = useState(-1);
  useEffect(() => {
    const q = value.trim(); if (!show || !q) { setOpts([]); return; }
    const id = setTimeout(() => api('/airports/search?q=' + encodeURIComponent(q)).then(setOpts).catch(() => setOpts([])), 150);
    return () => clearTimeout(id);
  }, [value, show]);
  const pick = a => { onChange(a.label); setShow(false); setHi(-1); };
  const key = e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setHi(h => Math.min(h + 1, opts.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHi(h => Math.max(h - 1, 0)); }
    else if (e.key === 'Enter' && show && hi >= 0 && opts[hi]) { e.preventDefault(); pick(opts[hi]); }
    else if (e.key === 'Escape') setShow(false);
  };
  return (<div className="fld ac"><span>{label}</span>
    <input value={value} placeholder="City, airport, country or code" autoComplete="off" role="combobox" aria-expanded={show && opts.length > 0}
      onChange={e => { onChange(e.target.value); setShow(true); setHi(-1); }} onFocus={() => setShow(true)} onBlur={() => setTimeout(() => setShow(false), 150)} onKeyDown={key} />
    {show && opts.length > 0 && <ul className="opts" role="listbox">{opts.map((a, i) => <li key={a.code} role="option" className={i === hi ? 'on' : ''} onMouseDown={e => { e.preventDefault(); pick(a); }}><b>{a.label}</b><small>{a.name} · {a.country}</small></li>)}</ul>}
  </div>);
}

function Auth({ mode, setMode, onDone }) {
  const [v, setV] = useState({ name: '', email: '', password: '' }), [e, setE] = useState(''), [busy, setBusy] = useState(false);
  const submit = async ev => {
    ev.preventDefault(); setE(''); setBusy(true);
    try { const d = await api('/auth/' + mode, { method: 'POST', body: v }); localStorage.setItem('bw_token', d.token); onDone(d.user); }
    catch (x) { setE(x.message); } finally { setBusy(false); }
  };
  return (<div className="modal"><div className="back" onClick={() => setMode(null)} />
    <form className="box" onSubmit={submit}><h3>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h3>
      {mode === 'signup' && <label className="fld">Name<input value={v.name} onChange={x => setV({ ...v, name: x.target.value })} autoComplete="name" /></label>}
      <label className="fld">Email<input type="email" value={v.email} onChange={x => setV({ ...v, email: x.target.value })} autoComplete="email" /></label>
      <label className="fld">Password<input type="password" value={v.password} onChange={x => setV({ ...v, password: x.target.value })} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /></label>
      {e && <div className="msg warn" role="alert">{e}</div>}
      <button className="go" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Log In' : 'Sign Up'}</button>
      <button type="button" className="link" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>{mode === 'login' ? 'New here? Create an account' : 'Already have an account? Log in'}</button></form></div>);
}
