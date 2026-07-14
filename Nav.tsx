'use client';import {useState} from 'react';import {Nav} from '../../components/Nav';import {salesChannels,seasons} from '../../lib/constants';
export default function ContentStudioPage(){const[channel,setChannel]=useState('Instagram');const[brand,setBrand]=useState('');const[category,setCategory]=useState('');const[season,setSeason]=useState('Ganzjährig');const[price,setPrice]=useState('');const[text,setText]=useState('');function createDraft(){setText(`Mon Chic Vintage Paris – ${channel}

${brand||'Ausgewähltes Vintage Piece'} ${category?'· '+category:''}
Saison: ${season}

Ein elegantes Einzelstück mit französischem Flair. Sorgfältig ausgewählt, geprüft und bereit für eine neue Geschichte.

Preis: ${price?price+' €':'auf Anfrage'}

#vintage #luxuryvintage #monchicvintageparis #parisstyle`)}return <><Nav/><main className="mx-auto max-w-7xl p-6 space-y-5"><section className="card"><h1 className="text-3xl font-black text-monchic-green">Content Marketing Studio</h1><p>Texte für Instagram, Pinterest, TikTok, Vinted und eBay.</p></section><section className="card grid md:grid-cols-2 gap-4"><div className="space-y-3"><label className="label">Kanal</label><select className="input" value={channel} onChange={e=>setChannel(e.target.value)}>{salesChannels.map(i=><option key={i}>{i}</option>)}</select><label className="label">Marke</label><input className="input" value={brand} onChange={e=>setBrand(e.target.value)}/><label className="label">Kategorie</label><input className="input" value={category} onChange={e=>setCategory(e.target.value)}/><label className="label">Saison</label><select className="input" value={season} onChange={e=>setSeason(e.target.value)}>{seasons.map(i=><option key={i}>{i}</option>)}</select><label className="label">Preis</label><input className="input" value={price} onChange={e=>setPrice(e.target.value)}/><button type="button" className="btn" onClick={createDraft}>Content-Entwurf erzeugen</button></div><div><label className="label">Text</label><textarea className="input min-h-80" value={text} onChange={e=>setText(e.target.value)}/></div></section></main></>}
